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

# Predefined Redeem Codes
REDEEM_CODES = {
    "Prime": [
        "PRIME-19F18H1", "PRIME-7A3K9Q2", "PRIME-X8M4P6R", "PRIME-2L9D7WJ", "PRIME-H5Q8Z1A",
        "PRIME-4N6C9T8", "PRIME-KR7M2E5", "PRIME-P8D3F6X", "PRIME-9WJ4L7Q", "PRIME-Z1A5H8C",
        "PRIME-6T2N9M4", "PRIME-Q7P5X8R", "PRIME-3E6KJ9D", "PRIME-M8C2A7L", "PRIME-5R9H4N6"
    ],
    "Elite": [
        "ELITE-4P9XK7H", "ELITE-M6R3Q2N", "ELITE-8A7JH5C", "ELITE-ZP4E9L6", "ELITE-2D8NQK7",
        "ELITE-HM9R4X5", "ELITE-7C6P3A8", "ELITE-K2Z9E4J", "ELITE-Q8L5H7N", "ELITE-6R4X2M9",
        "ELITE-A9C7P5D", "ELITE-JH8Z6K3", "ELITE-5N4R9X7", "ELITE-E6Q2M8P", "ELITE-9K7H5A4"
    ],
    "Ace": [
        "ACE-9H4K2P7", "ACE-X6M8A5R", "ACE-3Q9N7H4", "ACE-K5P2D8X", "ACE-7R6A9M4",
        "ACE-2H8Q5KX", "ACE-N7P9R4D", "ACE-MA8X6H5", "ACE-4Q2K9P7", "ACE-8D5R6A9",
        "ACE-XP7H2M4", "ACE-9A6NQ8K", "ACE-5H4R7D2", "ACE-KM9P6X8", "ACE-2Q7A4H5"
    ],
    "Immortal": [
        "IMMORTAL-7X9H4K", "IMMORTAL-R8M5A2", "IMMORTAL-6P9QX7", "IMMORTAL-H4N8K2", "IMMORTAL-A9R6M5",
        "IMMORTAL-2X7H8P", "IMMORTAL-Q9K4R6", "IMMORTAL-5A8M7N", "IMMORTAL-XP4H9K", "IMMORTAL-8R6Q2A",
        "IMMORTAL-N5M7X9", "IMMORTAL-K4P2H8", "IMMORTAL-9A6R7Q", "IMMORTAL-HX8M5K", "IMMORTAL-2P9N4A"
    ],
    "Supreme": [
        "SUPREME-9KX4H7", "SUPREME-MA8R2P", "SUPREME-Q7H5K9", "SUPREME-4X2N8A", "SUPREME-R9P6M7",
        "SUPREME-HK8A5X", "SUPREME-2Q9R4M", "SUPREME-A7XK8H", "SUPREME-P5N9R6", "SUPREME-M4A2X7",
        "SUPREME-8K9H5Q", "SUPREME-R6P7A4", "SUPREME-XN2M8H", "SUPREME-9A5K4R", "SUPREME-H7Q8P2"
    ]
}


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
    amount: int
    username: str

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
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

class RankStock(BaseModel):
    rank_name: str
    total: int
    available: int
    in_stock: bool


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


async def initialize_redeem_codes():
    """Initialize redeem codes in database if not already present"""
    for rank_name, codes in REDEEM_CODES.items():
        for code in codes:
            existing = await db.redeem_codes.find_one({"code": code})
            if not existing:
                await db.redeem_codes.insert_one({
                    "code": code,
                    "rank_name": rank_name,
                    "used": False,
                    "username": None,
                    "used_at": None,
                    "order_id": None,
                    "payment_id": None
                })
    logger.info("Redeem codes initialized")


async def get_available_code(rank_name: str) -> Optional[str]:
    """Get an available redeem code for the rank"""
    code_doc = await db.redeem_codes.find_one({
        "rank_name": rank_name,
        "used": False
    })
    if code_doc:
        return code_doc["code"]
    return None


async def mark_code_as_used(code: str, username: str, order_id: str, payment_id: str):
    """Mark a redeem code as used"""
    await db.redeem_codes.update_one(
        {"code": code},
        {
            "$set": {
                "used": True,
                "username": username,
                "used_at": datetime.now(timezone.utc).isoformat(),
                "order_id": order_id,
                "payment_id": payment_id
            }
        }
    )


async def get_rank_stock(rank_name: str) -> dict:
    """Get stock information for a rank"""
    total = len(REDEEM_CODES.get(rank_name, []))
    used_count = await db.redeem_codes.count_documents({
        "rank_name": rank_name,
        "used": True
    })
    available = total - used_count
    return {
        "rank_name": rank_name,
        "total": total,
        "available": available,
        "in_stock": available > 0
    }


# Startup event to initialize codes
@app.on_event("startup")
async def startup_event():
    await initialize_redeem_codes()


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


# Stock Check Endpoint
@api_router.get("/stock")
async def get_all_stock():
    """Get stock information for all ranks"""
    stock_info = {}
    for rank_name in REDEEM_CODES.keys():
        stock = await get_rank_stock(rank_name)
        stock_info[rank_name] = stock
    return stock_info


@api_router.get("/stock/{rank_name}")
async def get_rank_stock_info(rank_name: str):
    """Get stock information for a specific rank"""
    if rank_name not in REDEEM_CODES:
        raise HTTPException(status_code=404, detail="Rank not found")
    return await get_rank_stock(rank_name)


# Razorpay Payment Routes
@api_router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    """Create a Razorpay order for rank purchase"""
    try:
        # Check if rank is in stock
        stock = await get_rank_stock(request.rank_name)
        if not stock["in_stock"]:
            raise HTTPException(status_code=400, detail=f"{request.rank_name} rank is out of stock")
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@api_router.post("/verify-payment", response_model=PaymentVerificationResponse)
async def verify_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment and assign redeem code"""
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
        
        # Get available redeem code
        redeem_code = await get_available_code(request.rank_name)
        
        if not redeem_code:
            logger.error(f"No available codes for rank: {request.rank_name}")
            raise HTTPException(status_code=400, detail=f"{request.rank_name} rank is out of stock")
        
        # Mark code as used
        await mark_code_as_used(
            redeem_code,
            request.username,
            request.razorpay_order_id,
            request.razorpay_payment_id
        )
        
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
