# Sports E-Commerce Platform

A modern, full-stack sports e-commerce website built with Next.js 15, TypeScript, and complete backend API integration.

## What is this?

This is a production-ready online sports store where users can browse products, add items to their cart, checkout, and manage their orders. It includes user authentication, payment processing with Stripe, and a complete admin-ready API.

## Features

### Shopping Experience
- Browse 25+ sports products across 8 categories
- Advanced search and filtering (category, price range, sorting)
- Shopping cart with real-time updates
- Product reviews and ratings
- Related product recommendations

### User Features
- User registration and login (JWT authentication)
- Order history and tracking
- Order cancellation with automatic stock restoration
- Secure checkout flow

### Payment & Orders
- Stripe payment integration (test mode included)
- Order management system
- Automatic stock tracking
- Payment webhook handling

### Technical Features
- Fully responsive design (mobile, tablet, desktop)
- Real-time cart synchronization with database
- Smooth animations and transitions
- Loading states and error handling
- Database-backed cart (syncs across devices when logged in)

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion  
**Backend:** Next.js API Routes, PostgreSQL (Turso), Drizzle ORM  
**Auth:** Better Auth (JWT + Bearer tokens)  
**Payments:** Stripe  

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

The database is already configured and seeded with products, categories, and test data.

## Database Management

View and manage your database through the Database Studio tab at the top right of the page.

---

For detailed API documentation and advanced configuration, see `API_DOCUMENTATION.md`.