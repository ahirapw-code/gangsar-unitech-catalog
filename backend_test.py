#!/usr/bin/env python3
"""
Backend API Test Suite for Gangsar Unitech Industrial Catalog
Tests all API endpoints with proper error handling and validation
"""

import requests
import json
import sys
from typing import Dict, Any

# Base URL from environment
BASE_URL = "https://precision-spareparts.preview.emergentagent.com/api"

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(test_name: str, passed: bool, message: str = ""):
    """Log test result"""
    if passed:
        test_results["passed"] += 1
        print(f"✅ PASS: {test_name}")
        if message:
            print(f"   {message}")
    else:
        test_results["failed"] += 1
        test_results["errors"].append(f"{test_name}: {message}")
        print(f"❌ FAIL: {test_name}")
        print(f"   {message}")
    print()

def test_get_categories():
    """Test GET /api/categories"""
    print("=" * 80)
    print("TEST: GET /api/categories")
    print("=" * 80)
    
    try:
        response = requests.get(f"{BASE_URL}/categories", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/categories - Status Code", False, 
                    f"Expected 200, got {response.status_code}")
            return None
        
        log_test("GET /api/categories - Status Code", True, "Status 200 OK")
        
        data = response.json()
        
        if not isinstance(data, list):
            log_test("GET /api/categories - Response Type", False, 
                    f"Expected array, got {type(data)}")
            return None
        
        log_test("GET /api/categories - Response Type", True, "Returns array")
        
        if len(data) != 6:
            log_test("GET /api/categories - Category Count", False, 
                    f"Expected 6 categories, got {len(data)}")
        else:
            log_test("GET /api/categories - Category Count", True, 
                    f"Found 6 categories")
        
        # Verify expected categories
        expected_slugs = ['bearings', 'industrial-valves', 'gearboxes', 
                         'pumps', 'mechanical-components', 'conveyor-parts']
        actual_slugs = [cat.get('slug') for cat in data]
        
        missing = set(expected_slugs) - set(actual_slugs)
        if missing:
            log_test("GET /api/categories - Expected Categories", False, 
                    f"Missing categories: {missing}")
        else:
            log_test("GET /api/categories - Expected Categories", True, 
                    "All expected categories present")
        
        return data
        
    except Exception as e:
        log_test("GET /api/categories", False, f"Exception: {str(e)}")
        return None

def test_get_products():
    """Test GET /api/products with various filters"""
    print("=" * 80)
    print("TEST: GET /api/products")
    print("=" * 80)
    
    # Test 1: Get products without filters
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products - Status Code", False, 
                    f"Expected 200, got {response.status_code}")
            return
        
        log_test("GET /api/products - Status Code", True, "Status 200 OK")
        
        data = response.json()
        
        # Verify response structure
        if not isinstance(data, dict):
            log_test("GET /api/products - Response Structure", False, 
                    f"Expected object, got {type(data)}")
            return
        
        if 'products' not in data or 'pagination' not in data:
            log_test("GET /api/products - Response Structure", False, 
                    "Missing 'products' or 'pagination' field")
            return
        
        log_test("GET /api/products - Response Structure", True, 
                "Has products and pagination fields")
        
        # Verify pagination structure
        pagination = data['pagination']
        required_fields = ['page', 'limit', 'total', 'pages']
        missing_fields = [f for f in required_fields if f not in pagination]
        
        if missing_fields:
            log_test("GET /api/products - Pagination Structure", False, 
                    f"Missing fields: {missing_fields}")
        else:
            log_test("GET /api/products - Pagination Structure", True, 
                    f"All pagination fields present: {pagination}")
        
    except Exception as e:
        log_test("GET /api/products", False, f"Exception: {str(e)}")
        return
    
    # Test 2: Filter by category
    try:
        response = requests.get(f"{BASE_URL}/products?category=bearings", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products?category=bearings", False, 
                    f"Expected 200, got {response.status_code}")
        else:
            data = response.json()
            products = data.get('products', [])
            
            # Verify all products are from bearings category
            non_bearing = [p for p in products if p.get('categorySlug') != 'bearings']
            if non_bearing:
                log_test("GET /api/products?category=bearings", False, 
                        f"Found {len(non_bearing)} non-bearing products")
            else:
                log_test("GET /api/products?category=bearings", True, 
                        f"All {len(products)} products are bearings")
        
    except Exception as e:
        log_test("GET /api/products?category=bearings", False, f"Exception: {str(e)}")
    
    # Test 3: Search filter
    try:
        response = requests.get(f"{BASE_URL}/products?search=bearing", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products?search=bearing", False, 
                    f"Expected 200, got {response.status_code}")
        else:
            data = response.json()
            products = data.get('products', [])
            
            if len(products) > 0:
                log_test("GET /api/products?search=bearing", True, 
                        f"Found {len(products)} products matching 'bearing'")
            else:
                log_test("GET /api/products?search=bearing", False, 
                        "No products found for search term 'bearing'")
        
    except Exception as e:
        log_test("GET /api/products?search=bearing", False, f"Exception: {str(e)}")
    
    # Test 4: Promo filter
    try:
        response = requests.get(f"{BASE_URL}/products?promo=true", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products?promo=true", False, 
                    f"Expected 200, got {response.status_code}")
        else:
            data = response.json()
            products = data.get('products', [])
            
            # Verify all products have isPromo=true
            non_promo = [p for p in products if not p.get('isPromo')]
            if non_promo:
                log_test("GET /api/products?promo=true", False, 
                        f"Found {len(non_promo)} non-promo products")
            else:
                log_test("GET /api/products?promo=true", True, 
                        f"All {len(products)} products are promo items")
        
    except Exception as e:
        log_test("GET /api/products?promo=true", False, f"Exception: {str(e)}")
    
    # Test 5: Sort by price-low
    try:
        response = requests.get(f"{BASE_URL}/products?sort=price-low", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products?sort=price-low", False, 
                    f"Expected 200, got {response.status_code}")
        else:
            data = response.json()
            products = data.get('products', [])
            
            if len(products) > 1:
                prices = [p.get('price', 0) for p in products]
                is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
                
                if is_sorted:
                    log_test("GET /api/products?sort=price-low", True, 
                            f"Products sorted by price ascending: {prices[:3]}...")
                else:
                    log_test("GET /api/products?sort=price-low", False, 
                            f"Products not sorted correctly: {prices[:5]}")
            else:
                log_test("GET /api/products?sort=price-low", True, 
                        "Insufficient products to verify sorting")
        
    except Exception as e:
        log_test("GET /api/products?sort=price-low", False, f"Exception: {str(e)}")

def test_get_product_by_slug():
    """Test GET /api/products/{slug}"""
    print("=" * 80)
    print("TEST: GET /api/products/{slug}")
    print("=" * 80)
    
    # Test 1: Valid slug
    try:
        slug = "ball-valve-dn50-stainless-steel"
        response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        
        if response.status_code != 200:
            log_test(f"GET /api/products/{slug} - Status Code", False, 
                    f"Expected 200, got {response.status_code}")
        else:
            log_test(f"GET /api/products/{slug} - Status Code", True, "Status 200 OK")
            
            data = response.json()
            
            # Verify product details
            if data.get('slug') != slug:
                log_test(f"GET /api/products/{slug} - Product Match", False, 
                        f"Expected slug '{slug}', got '{data.get('slug')}'")
            else:
                log_test(f"GET /api/products/{slug} - Product Match", True, 
                        "Product slug matches")
            
            # Verify relatedProducts field
            if 'relatedProducts' not in data:
                log_test(f"GET /api/products/{slug} - Related Products", False, 
                        "Missing 'relatedProducts' field")
            else:
                related = data['relatedProducts']
                log_test(f"GET /api/products/{slug} - Related Products", True, 
                        f"Has {len(related)} related products")
        
    except Exception as e:
        log_test(f"GET /api/products/{slug}", False, f"Exception: {str(e)}")
    
    # Test 2: Invalid slug (should return 404)
    try:
        invalid_slug = "non-existent-product-slug-12345"
        response = requests.get(f"{BASE_URL}/products/{invalid_slug}", timeout=10)
        
        if response.status_code != 404:
            log_test(f"GET /api/products/{invalid_slug} - 404 Response", False, 
                    f"Expected 404, got {response.status_code}")
        else:
            log_test(f"GET /api/products/{invalid_slug} - 404 Response", True, 
                    "Returns 404 for invalid slug")
        
    except Exception as e:
        log_test(f"GET /api/products/{invalid_slug}", False, f"Exception: {str(e)}")

def test_post_rfq():
    """Test POST /api/rfq"""
    print("=" * 80)
    print("TEST: POST /api/rfq")
    print("=" * 80)
    
    try:
        rfq_data = {
            "fullName": "John Manufacturing",
            "companyName": "ABC Industrial Solutions",
            "phone": "+62812345678",
            "email": "john@abcindustrial.com",
            "products": [
                {
                    "name": "Deep Groove Ball Bearing 6205-2RS",
                    "sku": "BRG-6205-2RS",
                    "quantity": 10
                },
                {
                    "name": "Ball Valve DN50 Stainless Steel",
                    "sku": "VLV-BV-DN50",
                    "quantity": 5
                }
            ],
            "notes": "Urgent requirement for ongoing project. Please provide best quote with delivery timeline."
        }
        
        response = requests.post(
            f"{BASE_URL}/rfq",
            json=rfq_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("POST /api/rfq - Status Code", False, 
                    f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
        
        log_test("POST /api/rfq - Status Code", True, "Status 200 OK")
        
        data = response.json()
        
        # Verify response structure
        if not data.get('success'):
            log_test("POST /api/rfq - Success Field", False, 
                    f"Expected success=true, got {data.get('success')}")
        else:
            log_test("POST /api/rfq - Success Field", True, "success=true")
        
        if 'rfq' not in data:
            log_test("POST /api/rfq - RFQ Object", False, 
                    "Missing 'rfq' field in response")
            return None
        
        rfq = data['rfq']
        
        # Verify RFQ has ID (UUID)
        if not rfq.get('id'):
            log_test("POST /api/rfq - RFQ ID", False, "Missing RFQ ID")
        else:
            log_test("POST /api/rfq - RFQ ID", True, f"RFQ created with ID: {rfq['id']}")
        
        # Verify RFQ data
        if rfq.get('fullName') != rfq_data['fullName']:
            log_test("POST /api/rfq - Data Integrity", False, 
                    "RFQ data doesn't match submitted data")
        else:
            log_test("POST /api/rfq - Data Integrity", True, 
                    "RFQ data matches submitted data")
        
        return rfq['id']
        
    except Exception as e:
        log_test("POST /api/rfq", False, f"Exception: {str(e)}")
        return None

def test_admin_login():
    """Test POST /api/auth/login"""
    print("=" * 80)
    print("TEST: POST /api/auth/login")
    print("=" * 80)
    
    # Test 1: Valid credentials
    try:
        login_data = {
            "email": "admin@gangsarunitech.com",
            "password": "Admin@123456"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("POST /api/auth/login - Valid Credentials", False, 
                    f"Expected 200, got {response.status_code}. Response: {response.text}")
            return None
        
        log_test("POST /api/auth/login - Valid Credentials", True, "Status 200 OK")
        
        data = response.json()
        
        # Verify token
        if not data.get('token'):
            log_test("POST /api/auth/login - Token", False, "Missing token in response")
            return None
        
        log_test("POST /api/auth/login - Token", True, "Token received")
        
        # Verify user object
        if not data.get('user'):
            log_test("POST /api/auth/login - User Object", False, "Missing user object")
            return None
        
        user = data['user']
        if user.get('email') != login_data['email']:
            log_test("POST /api/auth/login - User Email", False, 
                    f"Expected {login_data['email']}, got {user.get('email')}")
        else:
            log_test("POST /api/auth/login - User Email", True, "User email matches")
        
        if user.get('role') != 'admin':
            log_test("POST /api/auth/login - User Role", False, 
                    f"Expected 'admin', got {user.get('role')}")
        else:
            log_test("POST /api/auth/login - User Role", True, "User role is admin")
        
        return data['token']
        
    except Exception as e:
        log_test("POST /api/auth/login - Valid Credentials", False, f"Exception: {str(e)}")
        return None
    
    # Test 2: Invalid credentials
    try:
        invalid_login = {
            "email": "admin@gangsarunitech.com",
            "password": "WrongPassword123"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=invalid_login,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code != 401:
            log_test("POST /api/auth/login - Invalid Credentials", False, 
                    f"Expected 401, got {response.status_code}")
        else:
            log_test("POST /api/auth/login - Invalid Credentials", True, 
                    "Returns 401 for invalid credentials")
        
    except Exception as e:
        log_test("POST /api/auth/login - Invalid Credentials", False, f"Exception: {str(e)}")

def test_admin_stats(token: str):
    """Test GET /api/admin/stats (requires auth)"""
    print("=" * 80)
    print("TEST: GET /api/admin/stats")
    print("=" * 80)
    
    # Test 1: Without token (should return 401)
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if response.status_code != 401:
            log_test("GET /api/admin/stats - No Auth", False, 
                    f"Expected 401, got {response.status_code}")
        else:
            log_test("GET /api/admin/stats - No Auth", True, 
                    "Returns 401 without authentication")
        
    except Exception as e:
        log_test("GET /api/admin/stats - No Auth", False, f"Exception: {str(e)}")
    
    # Test 2: With valid token
    if not token:
        log_test("GET /api/admin/stats - With Auth", False, 
                "No token available for testing")
        return
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/admin/stats - With Auth", False, 
                    f"Expected 200, got {response.status_code}. Response: {response.text}")
            return
        
        log_test("GET /api/admin/stats - With Auth", True, "Status 200 OK")
        
        data = response.json()
        
        # Verify stats structure
        required_fields = ['totalProducts', 'totalCategories', 'totalRFQs', 'pendingRFQs']
        missing_fields = [f for f in required_fields if f not in data]
        
        if missing_fields:
            log_test("GET /api/admin/stats - Stats Structure", False, 
                    f"Missing fields: {missing_fields}")
        else:
            log_test("GET /api/admin/stats - Stats Structure", True, 
                    f"All stats fields present: {data}")
        
        # Verify stats values are numbers
        for field in required_fields:
            if field in data and not isinstance(data[field], (int, float)):
                log_test(f"GET /api/admin/stats - {field} Type", False, 
                        f"Expected number, got {type(data[field])}")
                return
        
        log_test("GET /api/admin/stats - Stats Values", True, 
                "All stats values are numbers")
        
    except Exception as e:
        log_test("GET /api/admin/stats - With Auth", False, f"Exception: {str(e)}")

def test_get_rfqs(token: str):
    """Test GET /api/rfq (requires auth)"""
    print("=" * 80)
    print("TEST: GET /api/rfq")
    print("=" * 80)
    
    # Test 1: Without token (should return 401)
    try:
        response = requests.get(f"{BASE_URL}/rfq", timeout=10)
        
        if response.status_code != 401:
            log_test("GET /api/rfq - No Auth", False, 
                    f"Expected 401, got {response.status_code}")
        else:
            log_test("GET /api/rfq - No Auth", True, 
                    "Returns 401 without authentication")
        
    except Exception as e:
        log_test("GET /api/rfq - No Auth", False, f"Exception: {str(e)}")
    
    # Test 2: With valid token
    if not token:
        log_test("GET /api/rfq - With Auth", False, 
                "No token available for testing")
        return
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/rfq", headers=headers, timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/rfq - With Auth", False, 
                    f"Expected 200, got {response.status_code}. Response: {response.text}")
            return
        
        log_test("GET /api/rfq - With Auth", True, "Status 200 OK")
        
        data = response.json()
        
        if not isinstance(data, list):
            log_test("GET /api/rfq - Response Type", False, 
                    f"Expected array, got {type(data)}")
            return
        
        log_test("GET /api/rfq - Response Type", True, 
                f"Returns array with {len(data)} RFQs")
        
        # Verify RFQs are sorted by createdAt descending
        if len(data) > 1:
            dates = [rfq.get('createdAt') for rfq in data if rfq.get('createdAt')]
            if len(dates) > 1:
                is_sorted = all(dates[i] >= dates[i+1] for i in range(len(dates)-1))
                if is_sorted:
                    log_test("GET /api/rfq - Sorting", True, 
                            "RFQs sorted by createdAt descending")
                else:
                    log_test("GET /api/rfq - Sorting", False, 
                            "RFQs not sorted correctly")
        
    except Exception as e:
        log_test("GET /api/rfq - With Auth", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Passed: {test_results['passed']}")
    print(f"Total Failed: {test_results['failed']}")
    print(f"Total Tests: {test_results['passed'] + test_results['failed']}")
    
    if test_results['failed'] > 0:
        print("\n❌ FAILED TESTS:")
        for error in test_results['errors']:
            print(f"  - {error}")
    else:
        print("\n✅ ALL TESTS PASSED!")
    
    print("=" * 80)
    
    return test_results['failed'] == 0

def main():
    """Run all tests"""
    print("\n" + "=" * 80)
    print("GANGSAR UNITECH BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print("=" * 80 + "\n")
    
    # Run tests in order
    test_get_categories()
    test_get_products()
    test_get_product_by_slug()
    test_post_rfq()
    
    # Login and get token for protected endpoints
    token = test_admin_login()
    
    # Test protected endpoints
    test_admin_stats(token)
    test_get_rfqs(token)
    
    # Print summary
    success = print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
