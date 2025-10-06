# SportsPro - Modern Sports E-Commerce Platform

A complete, modern sports e-commerce website built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. Features a beautiful UI with parallax effects, smooth animations, and a fully functional shopping experience.

![SportsPro Banner](https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop)

## ✨ Features

### 🎨 Modern UI/UX
- **Parallax Hero Section** - Eye-catching hero with smooth parallax scrolling
- **Smooth Animations** - Framer Motion animations throughout
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark Mode Ready** - Built with dark mode support in mind

### 🛍️ Shopping Experience
- **Product Catalog** - Browse products with advanced filtering
- **Search & Filter** - Real-time search with category, brand, and price filters
- **Product Details** - Rich product pages with image gallery
- **Shopping Cart** - Persistent cart with localStorage
- **Checkout Flow** - Complete checkout process with order confirmation

### 🔧 Technical Features
- **Next.js 15** - Latest features with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Modern utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Efficient data fetching and caching
- **Zustand** - Lightweight state management
- **Parallax Scrolling** - react-scroll-parallax integration

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Homepage
│   │   ├── products/            # Product pages
│   │   │   ├── page.tsx         # Product listing
│   │   │   └── [slug]/          # Product detail
│   │   ├── checkout/            # Checkout pages
│   │   │   ├── page.tsx         # Checkout form
│   │   │   └── success/         # Order success
│   │   ├── account/             # User account
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── Header.tsx           # Site header with cart
│   │   ├── Footer.tsx           # Site footer
│   │   ├── ProductCard.tsx      # Product card component
│   │   ├── ParallaxHero.tsx     # Hero section
│   │   ├── FeaturedCollections.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── StatsSection.tsx
│   │   └── NewsletterSection.tsx
│   ├── lib/                     # Utilities
│   │   ├── providers.tsx        # React Query & Parallax providers
│   │   └── mock-data.ts         # Mock product data
│   ├── store/                   # State management
│   │   └── cart-store.ts        # Zustand cart store
│   └── types/                   # TypeScript types
│       └── index.ts             # Type definitions
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sportspro
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Run the development server**
```bash
npm run dev
# or
bun dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Dependencies

### Core
- **next**: ^15.1.3 - React framework
- **react**: ^19.0.0 - UI library
- **typescript**: ^5 - Type safety

### Styling
- **tailwindcss**: ^4 - Utility-first CSS
- **shadcn/ui** - Pre-built accessible components

### Animation & Effects
- **framer-motion**: ^11 - Animation library
- **react-scroll-parallax**: ^3.5.0 - Parallax effects

### State & Data
- **@tanstack/react-query**: ^5 - Data fetching
- **zustand**: ^5 - State management

### UI Components
- **lucide-react** - Icon library
- **@radix-ui/** - Headless UI components

## 🎨 Key Components

### ParallaxHero
The main hero section with parallax scrolling effect:
```tsx
<ParallaxHero />
```

### ProductCard
Reusable product card with animations:
```tsx
<ProductCard product={product} index={0} />
```

### ProductCarousel
Horizontal scrolling product carousel:
```tsx
<ProductCarousel 
  products={products}
  title="Trending Now"
  subtitle="Hot picks this season"
/>
```

### Header
Sticky header with cart functionality:
```tsx
<Header />
```

## 🛒 Cart Management

The shopping cart uses Zustand for state management with localStorage persistence:

```tsx
import { useCartStore } from '@/store/cart-store';

// Add item to cart
const addItem = useCartStore((state) => state.addItem);
addItem(product, size, color, quantity);

// Get cart items
const items = useCartStore((state) => state.items);

// Get total
const total = useCartStore((state) => state.getTotal());
```

## 🎯 Pages

### Homepage (`/`)
- Parallax hero section
- Featured product categories
- Trending products carousel
- Statistics section
- Featured products
- Newsletter signup

### Products (`/products`)
- Product grid with filters
- Search functionality
- Category filters
- Brand filters
- Price range filter
- Sort options
- Mobile-friendly filters

### Product Detail (`/products/[slug]`)
- Image gallery with thumbnails
- Product information
- Size & color selection
- Quantity selector
- Add to cart
- Related products

### Checkout (`/checkout`)
- Shipping information form
- Payment details form
- Order summary
- Cart review

### Order Success (`/checkout/success`)
- Order confirmation
- Order details
- Email confirmation notice

### Account (`/account`)
- Order history
- Favorite products
- Saved addresses
- Payment methods
- Account settings

## 🎨 Styling Guide

### Colors
The project uses a custom color scheme with primary purple/blue:
- Primary: `oklch(0.45 0.25 260)`
- Background: White/Dark based on theme
- Borders: Subtle gray tones

### Typography
- Font Family: Inter (Google Fonts)
- Headings: Bold weight
- Body: Regular weight

### Animations
- Page transitions: Fade + slide
- Hover effects: Scale + color
- Cart animations: Spring physics

## 🔧 Customization

### Adding Products
Edit `src/lib/mock-data.ts`:
```typescript
export const products: Product[] = [
  {
    id: 'unique-id',
    slug: 'product-slug',
    name: 'Product Name',
    price: 99.99,
    // ... more fields
  },
];
```

### Adding Categories
Update categories in `src/lib/mock-data.ts`:
```typescript
export const categories: Category[] = [
  {
    id: '1',
    name: 'Running',
    slug: 'running',
    image: 'image-url',
  },
];
```

### Styling
Modify `src/app/globals.css` for global styles and color scheme.

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components adapt to different screen sizes with mobile-first design.

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Build for Production
```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Shadcn** - Beautiful UI components
- **Unsplash** - Product images
- **Framer** - Motion library

## 📞 Support

For support, email support@sportspro.com or open an issue.

---

Built with ❤️ using Next.js 15 and TypeScript