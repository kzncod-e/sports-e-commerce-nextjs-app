# Styling Guide - SportsPro

## Overview

This guide covers the styling conventions, design system, and best practices used in the SportsPro e-commerce platform.

## Design System

### Color Palette

#### Light Mode
```css
--background: oklch(1 0 0)              /* Pure white */
--foreground: oklch(0.145 0 0)          /* Near black */
--primary: oklch(0.45 0.25 260)         /* Purple-blue */
--primary-foreground: oklch(0.985 0 0)  /* White */
--muted: oklch(0.97 0 0)                /* Light gray */
--muted-foreground: oklch(0.556 0 0)    /* Medium gray */
--border: oklch(0.922 0 0)              /* Subtle border */
```

#### Dark Mode
```css
--background: oklch(0.145 0 0)          /* Near black */
--foreground: oklch(0.985 0 0)          /* White */
--primary: oklch(0.6 0.25 260)          /* Lighter purple-blue */
--border: oklch(1 0 0 / 10%)            /* Transparent white */
```

### Typography

#### Font Family
- **Primary**: Inter (Google Fonts)
- **Fallback**: System fonts

#### Font Sizes
```css
text-xs     /* 0.75rem - 12px */
text-sm     /* 0.875rem - 14px */
text-base   /* 1rem - 16px */
text-lg     /* 1.125rem - 18px */
text-xl     /* 1.25rem - 20px */
text-2xl    /* 1.5rem - 24px */
text-4xl    /* 2.25rem - 36px */
text-5xl    /* 3rem - 48px */
```

#### Font Weights
```css
font-normal   /* 400 - Body text */
font-medium   /* 500 - Emphasis */
font-semibold /* 600 - Subheadings */
font-bold     /* 700 - Headings */
```

### Spacing

Using Tailwind's default spacing scale (4px increments):
```css
gap-2    /* 8px */
gap-4    /* 16px */
gap-6    /* 24px */
gap-8    /* 32px */
p-4      /* 16px padding */
p-6      /* 24px padding */
p-8      /* 32px padding */
```

### Border Radius
```css
rounded-lg   /* 10px - Default cards */
rounded-xl   /* 12px - Large cards */
rounded-full /* 9999px - Pills & circles */
```

## Component Styling Patterns

### Cards
```tsx
<div className="rounded-lg border bg-card p-6">
  {/* Card content */}
</div>
```

### Buttons
```tsx
// Primary
<Button className="bg-primary text-primary-foreground">

// Secondary
<Button variant="outline">

// Ghost
<Button variant="ghost">
```

### Images
```tsx
// Product images - maintain aspect ratio
<img className="aspect-square object-cover rounded-lg" />

// Hero images - cover full container
<img className="h-full w-full object-cover" />
```

### Containers
```tsx
<div className="container mx-auto px-4">
  {/* Max-width: 1280px (7xl) with responsive padding */}
</div>
```

## Animation Patterns

### Framer Motion

#### Page Entry
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

#### Staggered Children
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
))}
```

#### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### CSS Transitions
```css
transition-colors    /* Color changes */
transition-transform /* Scale/rotate */
transition-all       /* Multiple properties */
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
2xl: 1536px /* 2X extra large */
```

### Common Patterns
```tsx
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hide on mobile
<div className="hidden md:block">

// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
```

## Component-Specific Styles

### Header
- Sticky positioning
- Backdrop blur
- Border bottom
- Height: 64px (h-16)

### Product Cards
- Aspect ratio: 1:1 for images
- Hover: Scale image 110%
- Border on hover becomes primary color

### Hero Section
- Height: 90vh
- Parallax speed: -20
- Gradient overlays for text readability

### Footer
- Background: muted/50
- Border top
- Padding: 48px (py-12)

## Best Practices

### 1. Use Semantic Colors
```tsx
// Good ✓
<div className="bg-primary text-primary-foreground">

// Avoid ✗
<div className="bg-blue-600 text-white">
```

### 2. Consistent Spacing
```tsx
// Good ✓
<div className="space-y-6">  {/* Vertical spacing */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Avoid ✗
<div>
  <div className="mb-6">Item 1</div>
  <div className="mb-8">Item 2</div>  {/* Inconsistent */}
</div>
```

### 3. Hover States
Always provide hover feedback:
```tsx
<button className="hover:bg-accent hover:text-accent-foreground transition-colors">
```

### 4. Loading States
```tsx
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### 5. Focus States
Ensure keyboard accessibility:
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary">
```

## Accessibility

### Color Contrast
- Text/Background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio

### Interactive Elements
- Minimum touch target: 44x44px
- Clear focus indicators
- Keyboard navigation support

### Images
Always include alt text:
```tsx
<img src={url} alt="Descriptive text" />
```

## Animation Performance

### Best Practices
1. Animate `transform` and `opacity` (GPU accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` sparingly
4. Reduce motion for accessibility

```tsx
<motion.div
  initial={{ opacity: 0, transform: 'translateY(20px)' }}
  animate={{ opacity: 1, transform: 'translateY(0)' }}
  // ✓ Good - GPU accelerated
>
```

## Dark Mode

The project is ready for dark mode. Toggle is not implemented but styles are prepared:

```tsx
// Component will automatically adapt
<div className="bg-background text-foreground">
```

To enable dark mode, add class to html element:
```tsx
<html className="dark">
```

## Custom Utilities

### Scrollbar Hide
```css
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Container
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

## File Organization

### Component Styles
- Keep styles in component files using className
- Extract reusable patterns to utility classes
- Use inline styles only for dynamic values

### Global Styles
Located in `src/app/globals.css`:
- CSS variables
- Base styles
- Utility classes
- Custom animations

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [OKLCH Color Picker](https://oklch.com)

---

Last updated: January 2024