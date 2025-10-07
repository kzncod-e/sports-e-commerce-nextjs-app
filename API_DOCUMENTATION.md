# Sports E-Commerce API Documentation

Complete REST API documentation for the sports e-commerce backend built with Next.js 15, TypeScript, and PostgreSQL (via Turso/SQLite).

## 📚 Table of Contents

- [Authentication](#authentication)
- [Products API](#products-api)
- [Categories API](#categories-api)
- [Cart API](#cart-api)
- [Orders API](#orders-api)
- [Reviews API](#reviews-api)
- [Stripe Payments API](#stripe-payments-api)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)

---

## 🔐 Authentication

All authenticated endpoints require an `Authorization: Bearer <token>` header or `x-user-id` header for testing.

### Register User
```bash
POST /api/auth/register

# Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Response (201 Created)
{
  "success": true,
  "message": "User registered successfully"
}
```

### Login User
```bash
POST /api/auth/login

# Request Body
{
  "email": "john@example.com",
  "password": "securePassword123",
  "rememberMe": true
}

# Response (200 OK)
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Get Current User Profile
```bash
GET /api/auth/profile
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🏃 Products API

### Get All Products (with filters)
```bash
GET /api/products?search=nike&categoryId=1&minPrice=50&maxPrice=200&sortBy=price&order=asc&page=1&limit=12

# Query Parameters
- search: string (optional) - Search in product name/description
- categoryId: number (optional) - Filter by category
- minPrice: number (optional) - Minimum price filter
- maxPrice: number (optional) - Maximum price filter
- sortBy: 'price' | 'name' | 'createdAt' (optional, default: 'createdAt')
- order: 'asc' | 'desc' (optional, default: 'desc')
- page: number (optional, default: 1)
- limit: number (optional, default: 12, max: 50)

# Response (200 OK)
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Nike Air Zoom Pegasus 40",
        "description": "The Nike Air Zoom Pegasus 40 delivers...",
        "price": 129.99,
        "stock": 45,
        "imageURL": "https://placehold.co/600x400/png?text=Nike",
        "categoryId": 1,
        "createdBy": null,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "category": {
          "id": 1,
          "name": "Running Shoes",
          "slug": "running-shoes"
        },
        "reviewsCount": 4
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 12,
      "totalPages": 3
    }
  }
}
```

### Get Single Product
```bash
GET /api/products?id=1

# Response (200 OK)
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Nike Air Zoom Pegasus 40",
      "description": "The Nike Air Zoom Pegasus 40 delivers...",
      "price": 129.99,
      "stock": 45,
      "imageURL": "https://placehold.co/600x400/png?text=Nike",
      "categoryId": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "category": {
      "id": 1,
      "name": "Running Shoes",
      "slug": "running-shoes"
    },
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Excellent product!",
        "createdAt": "2024-01-05T10:30:00Z",
        "userName": "John Smith",
        "userEmail": "john.smith@example.com",
        "userImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith"
      }
    ],
    "relatedProducts": [...]
  }
}
```

### Create Product
```bash
POST /api/products

# Request Body
{
  "name": "Nike Training Shoes",
  "description": "High-performance training shoes with advanced cushioning",
  "price": 149.99,
  "stock": 50,
  "imageURL": "https://example.com/image.jpg",
  "categoryId": 1,
  "createdBy": "user_123"
}

# Response (201 Created)
{
  "success": true,
  "data": {
    "id": 26,
    "name": "Nike Training Shoes",
    "price": 149.99,
    ...
  }
}
```

### Update Product
```bash
PUT /api/products?id=1

# Request Body (all fields optional)
{
  "name": "Updated Product Name",
  "price": 159.99,
  "stock": 30
}

# Response (200 OK)
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### Delete Product
```bash
DELETE /api/products?id=1

# Response (200 OK)
{
  "success": true,
  "message": "Product deleted successfully",
  "data": { "id": 1 }
}
```

---

## 📁 Categories API

### Get All Categories
```bash
GET /api/categories

# Response (200 OK)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Running Shoes",
      "slug": "running-shoes",
      "createdAt": "2024-01-01T00:00:00Z",
      "productsCount": 5
    }
  ]
}
```

### Get Category with Products
```bash
GET /api/categories?id=1

# Response (200 OK)
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Running Shoes",
      "slug": "running-shoes",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "products": [...]
  }
}
```

### Create Category
```bash
POST /api/categories

# Request Body
{
  "name": "Cycling Gear",
  "slug": "cycling-gear"  # Optional - auto-generated if not provided
}

# Response (201 Created)
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Cycling Gear",
    "slug": "cycling-gear",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Category
```bash
PUT /api/categories?id=1

# Request Body
{
  "name": "Premium Running Shoes"
}

# Response (200 OK)
{
  "success": true,
  "message": "Category updated successfully",
  "data": { ... }
}
```

### Delete Category
```bash
DELETE /api/categories?id=1

# Response (200 OK)
{
  "success": true,
  "message": "Category deleted successfully",
  "data": { "id": 1 }
}

# Error if category has products (400 Bad Request)
{
  "success": false,
  "message": "Cannot delete category with products"
}
```

---

## 🛒 Cart API

All cart endpoints require authentication (`Authorization: Bearer <token>` or `x-user-id` header).

### Get User's Cart
```bash
GET /api/cart
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "data": {
    "cart": {
      "id": 1,
      "userId": "user_123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "items": [
      {
        "cartItem": {
          "id": 1,
          "cartId": 1,
          "productId": 1,
          "quantity": 2,
          "createdAt": "2024-01-01T00:00:00Z",
          "updatedAt": "2024-01-01T00:00:00Z"
        },
        "product": {
          "id": 1,
          "name": "Nike Air Zoom Pegasus 40",
          "price": 129.99,
          "imageURL": "...",
          ...
        },
        "subtotal": 259.98
      }
    ],
    "total": 259.98
  }
}
```

### Add Item to Cart
```bash
POST /api/cart
Authorization: Bearer <token>

# Request Body
{
  "productId": 1,
  "quantity": 2
}

# Response (201 Created)
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart": { ... },
    "item": { ... }
  }
}

# Error - Insufficient Stock (400 Bad Request)
{
  "success": false,
  "message": "Insufficient stock"
}
```

### Update Cart Item Quantity
```bash
PUT /api/cart/items/1
Authorization: Bearer <token>

# Request Body
{
  "quantity": 3
}

# Response (200 OK)
{
  "success": true,
  "message": "Cart item updated",
  "data": { ... }
}
```

### Remove Item from Cart
```bash
DELETE /api/cart/items/1
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "message": "Item removed from cart"
}
```

### Clear Entire Cart
```bash
DELETE /api/cart
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## 📦 Orders API

All order endpoints require authentication (`Authorization: Bearer <token>` or `x-user-id` header).

### Get User's Orders
```bash
GET /api/orders
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "data": [
    {
      "order": {
        "id": 1,
        "userId": "user_123",
        "totalAmount": 259.98,
        "status": "pending",
        "paymentIntentId": "pi_1234567890",
        "shippingAddress": "123 Main St, City, State 12345",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      "items": [
        {
          "orderItem": {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 2,
            "price": 129.99,
            "createdAt": "2024-01-01T00:00:00Z"
          },
          "product": { ... }
        }
      ],
      "itemsCount": 1
    }
  ]
}
```

### Get Single Order Details
```bash
GET /api/orders/1
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "data": {
    "order": { ... },
    "items": [
      {
        "orderItem": { ... },
        "product": { ... },
        "subtotal": 259.98
      }
    ]
  }
}
```

### Create Order (from cart)
```bash
POST /api/orders
Authorization: Bearer <token>

# Request Body
{
  "shippingAddress": "123 Main St, City, State 12345"
}

# Response (201 Created)
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "userId": "user_123",
      "totalAmount": 259.98,
      "status": "pending",
      "shippingAddress": "123 Main St, City, State 12345",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "items": [...]
  }
}

# Error - Cart Empty (400 Bad Request)
{
  "success": false,
  "message": "Cart is empty"
}

# Error - Insufficient Stock (400 Bad Request)
{
  "success": false,
  "message": "Product Nike Air Zoom Pegasus 40 is out of stock"
}
```

### Update Order Status
```bash
PUT /api/orders/1
Authorization: Bearer <token>

# Request Body
{
  "status": "processing"  # Options: pending, processing, completed, cancelled
}

# Response (200 OK)
{
  "success": true,
  "message": "Order status updated",
  "data": { ... }
}

# Note: Cancelling an order restores product stock
```

---

## ⭐ Reviews API

### Get Product Reviews
```bash
GET /api/reviews?productId=1&limit=20&offset=0

# Response (200 OK)
{
  "success": true,
  "data": {
    "reviews": [
      {
        "review": {
          "id": 1,
          "userId": "test-user-1",
          "productId": 1,
          "rating": 5,
          "comment": "Excellent product! Exceeded my expectations",
          "createdAt": "2024-01-05T10:30:00Z",
          "updatedAt": "2024-01-05T10:30:00Z"
        },
        "user": {
          "id": "test-user-1",
          "name": "John Smith",
          "image": "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith"
        }
      }
    ],
    "stats": {
      "averageRating": 4.25,
      "totalReviews": 4
    }
  }
}
```

### Create Review (requires authentication)
```bash
POST /api/reviews
Authorization: Bearer <token>

# Request Body
{
  "productId": 1,
  "rating": 5,
  "comment": "Amazing product, highly recommend!"
}

# Response (201 Created)
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 49,
    "userId": "user_123",
    "productId": 1,
    "rating": 5,
    "comment": "Amazing product, highly recommend!",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}

# Error - Duplicate Review (400 Bad Request)
{
  "success": false,
  "message": "You have already reviewed this product"
}
```

### Update Review (requires authentication, owner only)
```bash
PUT /api/reviews/1
Authorization: Bearer <token>

# Request Body (both fields optional)
{
  "rating": 4,
  "comment": "Updated my review after using for longer"
}

# Response (200 OK)
{
  "success": true,
  "message": "Review updated successfully",
  "data": { ... }
}

# Error - Unauthorized (403 Forbidden)
{
  "success": false,
  "message": "Unauthorized to update this review"
}
```

### Delete Review (requires authentication, owner only)
```bash
DELETE /api/reviews/1
Authorization: Bearer <token>

# Response (200 OK)
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 💳 Stripe Payments API

### Get Stripe Configuration
```bash
GET /api/stripe/config

# Response (200 OK)
{
  "success": true,
  "data": {
    "publishableKey": "pk_test_..."
  }
}
```

### Create Payment Intent
```bash
POST /api/stripe/payment-intent
Authorization: Bearer <token>

# Request Body
{
  "amount": 259.98,
  "currency": "usd",
  "orderId": 1,
  "metadata": {
    "customerName": "John Doe",
    "email": "john@example.com"
  }
}

# Response (201 Created)
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdefg",
    "paymentIntentId": "pi_1234567890",
    "amount": 25998,
    "currency": "usd"
  }
}
```

### Webhook Handler (Stripe webhook events)
```bash
POST /api/stripe/webhook
Stripe-Signature: <stripe_signature>

# Handles events:
- payment_intent.succeeded → Updates order status to "processing"
- payment_intent.payment_failed → Updates order status to "cancelled"
- charge.refunded → Updates order status to "cancelled"

# Response (200 OK)
{
  "success": true,
  "received": true
}
```

---

## ⚠️ Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## 🗄️ Database Schema

### User Table
```sql
user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  emailVerified BOOLEAN DEFAULT false,
  image TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

### Category Table
```sql
category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  createdAt TEXT NOT NULL
)
```

### Product Table
```sql
product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  imageURL TEXT,
  categoryId INTEGER REFERENCES category(id),
  createdBy TEXT REFERENCES user(id),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

### Cart & CartItem Tables
```sql
cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT UNIQUE REFERENCES user(id),
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)

cartItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cartId INTEGER REFERENCES cart(id) ON DELETE CASCADE,
  productId INTEGER REFERENCES product(id),
  quantity INTEGER DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

### Order & OrderItem Tables
```sql
order (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT REFERENCES user(id),
  totalAmount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  paymentIntentId TEXT,
  shippingAddress TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)

orderItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orderId INTEGER REFERENCES order(id) ON DELETE CASCADE,
  productId INTEGER REFERENCES product(id),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  createdAt TEXT NOT NULL
)
```

### Review Table
```sql
review (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT REFERENCES user(id),
  productId INTEGER REFERENCES product(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Run Database Migrations
```bash
npm run db:push
```

### 4. Seed Database (optional)
```bash
# Run seeders
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

API will be available at: `http://localhost:3000/api`

---

## 📝 Example API Usage

### Complete Order Flow Example
```bash
# 1. Register/Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 2. Browse Products
curl http://localhost:3000/api/products?categoryId=1&limit=10

# 3. Add to Cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":1,"quantity":2}'

# 4. Create Order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"shippingAddress":"123 Main St, City, State 12345"}'

# 5. Create Payment Intent
curl -X POST http://localhost:3000/api/stripe/payment-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"amount":259.98,"currency":"usd","orderId":1}'

# 6. Leave Review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":1,"rating":5,"comment":"Great product!"}'
```

---

## 🧪 Testing

### Test Users (seeded data)
- test-user-1 to test-user-5
- Use `x-user-id: test-user-1` header for testing authenticated endpoints

### Test Products
- 25 products across 8 categories
- Prices range from $24.99 to $399.99
- Stock levels vary from 5 to 100 units

### Test with cURL
```bash
# Test authentication
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-1" \
  -d '{"productId":1,"quantity":2}'
```

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the `.env.example` file
3. Verify all environment variables are set correctly
4. Check the console for error messages

---

**Built with Next.js 15, TypeScript, Drizzle ORM, Better Auth, Stripe, and Zod** 🚀