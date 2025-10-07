# Sports E-Commerce Platform - Full Stack

A modern, full-stack sports e-commerce platform built with Next.js 15, TypeScript, and complete backend API integration.

## 🎯 Project Overview

This is a **production-ready** sports e-commerce website featuring:

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **React Scroll Parallax** for engaging hero sections
- **Responsive Design** - mobile-first approach

### Backend API
- **Next.js API Routes** (REST API)
- **PostgreSQL** via Turso (SQLite)
- **Drizzle ORM** for database operations
- **Better Auth** for authentication (JWT + Bearer tokens)
- **Stripe Integration** for payments (test mode)
- **Zod** for input validation
- **Complete CRUD** for all resources

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sports-ecommerce
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- Turso database URL and auth token (already configured)
- Better Auth secret (already configured)
- Stripe test keys (get from https://dashboard.stripe.com/test/apikeys)
- Optional: Cloudinary credentials for image uploads

4. **Run database migrations** (already done)
```bash
npm run db:push
```

5. **Seed the database** (optional - database already seeded with 25 products, 8 categories, 5 test users, 48 reviews)
```bash
# Individual seeders
node src/db/seeds/category.ts
node src/db/seeds/product.ts
node src/db/seeds/user.ts
node src/db/seeds/review.ts
```

6. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
sports-ecommerce/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # Backend API Routes
│   │   │   ├── auth/            # Authentication (Better Auth)
│   │   │   ├── products/        # Products CRUD
│   │   │   ├── categories/      # Categories CRUD
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── orders/          # Order management
│   │   │   ├── reviews/         # Product reviews
│   │   │   └── stripe/          # Payment integration
│   │   ├── products/            # Product pages
│   │   ├── account/             # User account
│   │   ├── checkout/            # Checkout flow
│   │   └── page.tsx             # Homepage
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── ParallaxHero.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── db/                      # Database
│   │   ├── schema.ts            # Drizzle schema
│   │   ├── index.ts             # DB connection
│   │   └── seeds/               # Database seeders
│   ├── lib/                     # Utilities
│   │   ├── auth.ts              # Better Auth server config
│   │   ├── auth-client.ts       # Better Auth client
│   │   └── mock-data.ts         # Mock data
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── API_DOCUMENTATION.md         # Complete API docs
├── .env.example                 # Environment variables template
└── package.json
```

## 🔑 Key Features

### 🛒 E-Commerce Features
- ✅ **Product Catalog** - Browse 25+ sports products across 8 categories
- ✅ **Advanced Filtering** - Search, category filter, price range, sorting, pagination
- ✅ **Shopping Cart** - Add/remove items, update quantities, real-time totals
- ✅ **Checkout Flow** - Address collection, order creation, stock management
- ✅ **Order Management** - Order history, status tracking, cancellation with stock restoration
- ✅ **Product Reviews** - Rate and review products, view average ratings

### 🔐 Authentication
- ✅ **User Registration** - Email/password with Better Auth
- ✅ **User Login** - JWT + Bearer token authentication
- ✅ **Protected Routes** - Secure cart, orders, and reviews
- ✅ **Session Management** - Persistent sessions with auto-refresh

### 💳 Payment Integration
- ✅ **Stripe Test Mode** - Payment intent creation
- ✅ **Webhook Support** - Handle payment events (success, failure, refunds)
- ✅ **Order Status Updates** - Automatic status updates based on payment events

### 🎨 UI/UX
- ✅ **Parallax Hero** - Engaging scroll animations
- ✅ **Smooth Transitions** - Framer Motion animations
- ✅ **Loading States** - Skeleton loaders and suspense boundaries
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference including:

### Available Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

**Products**
- `GET /api/products` - List products (with filters)
- `GET /api/products?id={id}` - Get single product with reviews
- `POST /api/products` - Create product
- `PUT /api/products?id={id}` - Update product
- `DELETE /api/products?id={id}` - Delete product

**Categories**
- `GET /api/categories` - List all categories with product counts
- `GET /api/categories?id={id}` - Get category with products
- `POST /api/categories` - Create category
- `PUT /api/categories?id={id}` - Update category
- `DELETE /api/categories?id={id}` - Delete category

**Cart** (requires auth)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item quantity
- `DELETE /api/cart/items/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart

**Orders** (requires auth)
- `GET /api/orders` - Get user's order history
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order from cart
- `PUT /api/orders/{id}` - Update order status

**Reviews** (requires auth for POST/PUT/DELETE)
- `GET /api/reviews?productId={id}` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

**Stripe Payments**
- `GET /api/stripe/config` - Get publishable key
- `POST /api/stripe/payment-intent` - Create payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 🧪 Testing the API

### Test Users (Pre-seeded)
```
test-user-1 through test-user-5
Use x-user-id: test-user-1 header for testing
```

### Example Requests

**Get Products**
```bash
curl http://localhost:3000/api/products?search=nike&categoryId=1
```

**Add to Cart**
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-1" \
  -d '{"productId": 1, "quantity": 2}'
```

**Create Order**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-1" \
  -d '{"shippingAddress": "123 Main St, City, State 12345"}'
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete examples.

## 🗄️ Database Schema

### Core Tables
- **user** - User accounts (Better Auth)
- **session** - User sessions (Better Auth)
- **category** - Product categories (8 seeded)
- **product** - Products (25 seeded)
- **cart** - Shopping carts
- **cartItem** - Cart line items
- **order** - Customer orders
- **orderItem** - Order line items
- **review** - Product reviews (48 seeded)

### Database Management
```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# Open Drizzle Studio (view/edit data)
npm run db:studio
```

## 🎨 Tech Stack

### Frontend
- Next.js 15 (App Router, Server Components)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Scroll Parallax
- Shadcn/UI components
- Lucide React icons

### Backend
- Next.js API Routes
- Drizzle ORM
- Better Auth (JWT + Bearer tokens)
- Zod validation
- Stripe payments
- Turso (SQLite) database

### Development
- ESLint
- TypeScript
- Git

## 🔒 Security Features

- ✅ JWT authentication with Better Auth
- ✅ Bearer token authorization
- ✅ Password hashing (bcrypt via Better Auth)
- ✅ Input validation (Zod schemas)
- ✅ SQL injection protection (Drizzle ORM)
- ✅ CORS configuration
- ✅ Secure webhook verification (Stripe)

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
Add these in Vercel dashboard:
- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `BETTER_AUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
npm run db:studio    # Open Drizzle Studio
```

## 🤝 Contributing

This is a demo project. For production use:
1. Add proper error logging (Sentry)
2. Implement rate limiting
3. Add email verification
4. Set up Redis for caching
5. Add comprehensive test suite
6. Implement image optimization (Cloudinary)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Stripe for payment integration
- Better Auth for authentication
- Drizzle team for the excellent ORM

---

**Built with ❤️ using Next.js 15, TypeScript, and modern web technologies**

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)