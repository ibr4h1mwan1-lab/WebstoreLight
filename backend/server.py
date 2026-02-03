from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import razorpay
import hmac
import hashlib
import secrets
import string

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(
    os.environ.get('RAZORPAY_KEY_ID', ''),
    os.environ.get('RAZORPAY_KEY_SECRET', '')
))

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Razorpay Models
class CreateOrderRequest(BaseModel):
    rank_id: int
    rank_name: str
    amount: int  # Amount in INR (will be converted to paise)
    username: str

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int  # Amount in paise
    currency: str
    key_id: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    username: str
    rank_name: str
    amount: int

class PaymentVerificationResponse(BaseModel):
    success: bool
    message: str
    redeem_code: Optional[str] = None
    rank_name: Optional[str] = None
    username: Optional[str] = None

class Purchase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    payment_id: Optional[str] = None
    username: str
    rank_name: str
    amount: int
    status: str = "created"
    redeem_code: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


def generate_redeem_code(rank_name: str) -> str:
    """Generate a unique redeem code for the rank"""
    # Format: SNOWY-{RANK_PREFIX}-{RANDOM_CODE}
    rank_prefix = rank_name[:3].upper()
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    return f"SNOWY-{rank_prefix}-{random_part}"


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify Razorpay payment signature"""
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET', '')
    message = f"{order_id}|{payment_id}"
    generated_signature = hmac.new(
        key_secret.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(generated_signature, signature)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Razorpay Payment Routes
@api_router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    """Create a Razorpay order for rank purchase"""
    try:
        # Amount in paise (multiply by 100)
        amount_paise = request.amount * 100
        
        # Create Razorpay order
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "rank_id": str(request.rank_id),
                "rank_name": request.rank_name,
                "username": request.username
            }
        }
        
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Save order to database
        purchase = Purchase(
            order_id=razorpay_order['id'],
            username=request.username,
            rank_name=request.rank_name,
            amount=request.amount,
            status="created"
        )
        
        doc = purchase.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        if doc['completed_at']:
            doc['completed_at'] = doc['completed_at'].isoformat()
        
        await db.purchases.insert_one(doc)
        
        logger.info(f"Order created: {razorpay_order['id']} for user {request.username}")
        
        return CreateOrderResponse(
            order_id=razorpay_order['id'],
            amount=amount_paise,
            currency="INR",
            key_id=os.environ.get('RAZORPAY_KEY_ID', '')
        )
        
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@api_router.post("/verify-payment", response_model=PaymentVerificationResponse)
async def verify_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment and generate redeem code"""
    try:
        # Verify signature
        is_valid = verify_razorpay_signature(
            request.razorpay_order_id,
            request.razorpay_payment_id,
            request.razorpay_signature
        )
        
        if not is_valid:
            logger.warning(f"Invalid signature for order: {request.razorpay_order_id}")
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Generate redeem code
        redeem_code = generate_redeem_code(request.rank_name)
        
        # Update purchase in database
        await db.purchases.update_one(
            {"order_id": request.razorpay_order_id},
            {
                "$set": {
                    "payment_id": request.razorpay_payment_id,
                    "status": "completed",
                    "redeem_code": redeem_code,
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Also save to redeem_codes collection for easy lookup
        await db.redeem_codes.insert_one({
            "code": redeem_code,
            "rank_name": request.rank_name,
            "username": request.username,
            "amount": request.amount,
            "order_id": request.razorpay_order_id,
            "payment_id": request.razorpay_payment_id,
            "redeemed": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        logger.info(f"Payment verified for order: {request.razorpay_order_id}, redeem code: {redeem_code}")
        
        return PaymentVerificationResponse(
            success=True,
            message="Payment successful! Your redeem code has been generated.",
            redeem_code=redeem_code,
            rank_name=request.rank_name,
            username=request.username
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to verify payment: {str(e)}")


@api_router.get("/purchases/{username}")
async def get_user_purchases(username: str):
    """Get all purchases for a user"""
    purchases = await db.purchases.find(
        {"username": username, "status": "completed"},
        {"_id": 0}
    ).to_list(100)
    return purchases


@api_router.get("/recent-purchases")
async def get_recent_purchases():
    """Get recent completed purchases for history page"""
    purchases = await db.purchases.find(
        {"status": "completed"},
        {"_id": 0, "username": 1, "rank_name": 1, "amount": 1, "completed_at": 1}
    ).sort("completed_at", -1).to_list(20)
    return purchases


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
