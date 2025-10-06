# Development Guide - SportsPro

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd sportspro
npm install  # or: bun install
```

2. **Start Development Server**
```bash
npm run dev
# or
bun dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: Shadcn/ui + Radix UI

### Folder Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Homepage
│   ├── products/     # Product pages
│   ├── checkout/     # Checkout flow
│   ├── account/      # User account
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/          # Shadcn/ui components
│   └── *.tsx        # Custom components
├── lib/             # Utilities & helpers
├── store/           # Zustand stores
└── types/           # TypeScript definitions
```

## Development Workflow

### Adding a New Page

1. **Create page file**
```tsx
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. **Add to navigation** (if needed)
```tsx
// src/components/Header.tsx
const navigation = [
  // ... existing items
  { name: 'New Page', href: '/new-page' },
];
```

### Adding a New Component

1. **Create component file**
```tsx
// src/components/MyComponent.tsx
'use client';

import { motion } from 'framer-motion';

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Component content
    </motion.div>
  );
}
```

2. **Use in pages**
```tsx
import { MyComponent } from '@/components/MyComponent';

export default function Page() {
  return <MyComponent />;
}
```

### Working with the Cart Store

```tsx
'use client';

import { useCartStore } from '@/store/cart-store';

export function MyComponent() {
  // Get state
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  
  // Get actions
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  
  // Use in handlers
  const handleAdd = () => {
    addItem(product, 'M', 'Blue', 1);
  };
  
  return <div>{/* ... */}</div>;
}
```

### Adding Mock Data

Edit `src/lib/mock-data.ts`:

```typescript
export const products: Product[] = [
  {
    id: 'unique-id',
    slug: 'product-slug',
    name: 'Product Name',
    description: 'Product description',
    price: 99.99,
    originalPrice: 129.99, // Optional
    category: 'running',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/...',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Blue'],
    inStock: true,
    featured: false,
    trending: false,
    rating: 4.5,
    reviews: 100,
  },
];
```

## Styling Guidelines

### Using Tailwind Classes

```tsx
// Good ✓
<div className="flex items-center gap-4 p-6 rounded-lg border">

// Component-specific responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Adding Animations

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

### Using Parallax

```tsx
import { Parallax } from 'react-scroll-parallax';

<Parallax speed={-20}>
  <div>Content that moves slower on scroll</div>
</Parallax>
```

## TypeScript

### Defining Types

Add types to `src/types/index.ts`:

```typescript
export interface MyType {
  id: string;
  name: string;
  // ... more fields
}
```

### Using Types

```tsx
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  // ...
}
```

## Common Tasks

### Adding a Shadcn/ui Component

```bash
npx shadcn@latest add button
# or
bunx shadcn@latest add button
```

### Installing a Package

```bash
npm install package-name
# or
bun add package-name
```

### Updating Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.45 0.25 260);
  /* ... other colors */
}
```

### Creating a New Route

```tsx
// src/app/my-route/page.tsx
export default function MyRoute() {
  return <div>My Route</div>;
}
```

## Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works on all screen sizes
- [ ] Products page filters work
- [ ] Individual product pages load
- [ ] Add to cart functionality
- [ ] Cart persists on page reload
- [ ] Checkout flow completes
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Images load correctly

### Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimization

### Images

```tsx
// Use Next.js Image for optimization
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // For above-the-fold images
/>
```

### Code Splitting

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Memoization

```tsx
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Debugging

### React DevTools
Install React Developer Tools extension for your browser.

### Console Logging
```tsx
console.log('Debug:', variable);
```

### Zustand DevTools
```tsx
import { devtools } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store implementation
      }),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
);
```

## Common Issues

### Issue: Animations not working
**Solution**: Ensure component has `'use client'` directive

```tsx
'use client';  // Add this at the top

import { motion } from 'framer-motion';
```

### Issue: Cart not persisting
**Solution**: Check localStorage is enabled and working

```tsx
// Clear cart storage if corrupted
localStorage.removeItem('cart-storage');
```

### Issue: Images not loading
**Solution**: 
1. Check image URLs are valid
2. Ensure images are accessible
3. Use placeholder for broken images

### Issue: Build errors
**Solution**:
```bash
# Clean and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## Git Workflow

### Branching Strategy

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature
```

### Commit Messages

Follow conventional commits:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance
```

## Building for Production

### Build Command
```bash
npm run build
```

### Preview Production Build
```bash
npm run start
```

### Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Production Deploy**
```bash
vercel --prod
```

### Other Platforms

- **Netlify**: Connect GitHub repo
- **Docker**: Use provided Dockerfile
- **VPS**: Build and run with PM2

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

---

Happy coding! 🚀