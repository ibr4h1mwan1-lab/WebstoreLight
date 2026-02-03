#!/usr/bin/env python3
"""
Backend Test Suite for SNOWY MC Minecraft Store - Razorpay Integration
Tests the payment integration endpoints and database operations.
"""

import requests
import json
import os
from datetime import datetime
import time

# Backend URL from environment
BACKEND_URL = "https://craft-market-46.preview.emergentagent.com/api"

def test_create_order():
    """Test the create-order endpoint with Razorpay integration"""
    print("\n=== Testing POST /api/create-order ===")
    
    # Test data as specified in the review request
    test_data = {
        "rank_id": 1,
        "rank_name": "Prime",
        "amount": 49,
        "username": "TestPlayer123"
    }
    
    print(f"Request URL: {BACKEND_URL}/create-order")
    print(f"Request Body: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/create-order",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Response Body: {json.dumps(response_data, indent=2)}")
            
            # Validate response structure
            required_fields = ["order_id", "amount", "currency", "key_id"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if missing_fields:
                print(f"❌ FAILED: Missing required fields: {missing_fields}")
                return False
            
            # Validate response values
            expected_amount = 4900  # 49 INR * 100 = 4900 paise
            if response_data["amount"] != expected_amount:
                print(f"❌ FAILED: Expected amount {expected_amount}, got {response_data['amount']}")
                return False
            
            if response_data["currency"] != "INR":
                print(f"❌ FAILED: Expected currency INR, got {response_data['currency']}")
                return False
            
            if not response_data["key_id"]:
                print("❌ FAILED: key_id is empty")
                return False
            
            if not response_data["order_id"]:
                print("❌ FAILED: order_id is empty")
                return False
            
            print("✅ SUCCESS: Order created successfully with all required fields")
            print(f"   Order ID: {response_data['order_id']}")
            print(f"   Amount: {response_data['amount']} paise")
            print(f"   Currency: {response_data['currency']}")
            print(f"   Key ID: {response_data['key_id']}")
            
            return True, response_data["order_id"]
            
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error Response: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error Response (text): {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ FAILED: Request timeout (30s)")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ FAILED: Connection error - backend may be down")
        return False
    except Exception as e:
        print(f"❌ FAILED: Unexpected error: {str(e)}")
        return False

def test_backend_health():
    """Test if backend is responding"""
    print("\n=== Testing Backend Health ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        print(f"Health Check Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Backend is responding")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Backend health check failed: {str(e)}")
        return False

def test_recent_purchases():
    """Test the recent purchases endpoint to verify database operations"""
    print("\n=== Testing GET /api/recent-purchases (Database Verification) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/recent-purchases", timeout=10)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            purchases = response.json()
            print(f"✅ SUCCESS: Retrieved {len(purchases)} recent purchases")
            
            # Look for our test purchase
            test_purchase = None
            for purchase in purchases:
                if purchase.get("username") == "TestPlayer123" and purchase.get("rank_name") == "Prime":
                    test_purchase = purchase
                    break
            
            if test_purchase:
                print("✅ SUCCESS: Test purchase found in database")
                print(f"   Purchase details: {json.dumps(test_purchase, indent=2)}")
            else:
                print("⚠️  WARNING: Test purchase not found in recent purchases (may be expected if not completed)")
            
            return True
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAILED: Error checking recent purchases: {str(e)}")
        return False

def check_backend_logs():
    """Check backend logs for order creation"""
    print("\n=== Checking Backend Logs ===")
    
    try:
        # Check supervisor logs for backend
        import subprocess
        result = subprocess.run(
            ["tail", "-n", "50", "/var/log/supervisor/backend.out.log"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            logs = result.stdout
            print("Recent backend logs:")
            print("=" * 50)
            print(logs)
            print("=" * 50)
            
            # Look for order creation logs
            if "Order created:" in logs and "TestPlayer123" in logs:
                print("✅ SUCCESS: Order creation logged successfully")
                return True
            else:
                print("⚠️  WARNING: Order creation log not found in recent logs")
                return False
        else:
            print(f"❌ FAILED: Could not read backend logs: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ FAILED: Error checking logs: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("🧪 SNOWY MC Minecraft Store - Backend Test Suite")
    print("=" * 60)
    print(f"Testing Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    results = {}
    
    # Test 1: Backend Health
    results["health"] = test_backend_health()
    
    # Test 2: Create Order (Main test)
    create_order_result = test_create_order()
    if isinstance(create_order_result, tuple):
        results["create_order"] = create_order_result[0]
        order_id = create_order_result[1]
    else:
        results["create_order"] = create_order_result
        order_id = None
    
    # Test 3: Database Verification
    results["database"] = test_recent_purchases()
    
    # Test 4: Log Verification
    results["logs"] = check_backend_logs()
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.upper()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if results["create_order"]:
        print("\n🎉 RAZORPAY INTEGRATION TEST PASSED!")
        print("✅ Order creation endpoint working")
        print("✅ Proper response format with all required fields")
        print("✅ Amount conversion to paise working correctly")
        print("✅ Razorpay key_id returned properly")
    else:
        print("\n❌ RAZORPAY INTEGRATION TEST FAILED!")
        print("❌ Order creation endpoint has issues")
    
    return results["create_order"]

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)