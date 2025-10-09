import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, size: string, color: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string, size: string, color: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

// Helper to get user ID from session
const getUserId = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get session from better-auth
    const response = await fetch('/api/auth/session', {
      credentials: 'include',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data?.user?.id || null;
  } catch {
    return null;
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      fetchCart: async () => {
        const userId = await getUserId();
        if (!userId) {
          // User not authenticated, use local storage only
          return;
        }

        try {
          set({ isLoading: true });
          const response = await fetch('/api/cart', {
            headers: {
              'x-user-id': userId,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch cart');

          const data = await response.json();
          if (data.success && data.data.items) {
            // Transform API response to CartItem format
            const items: CartItem[] = data.data.items.map((item: any) => ({
              product: {
                id: String(item.product.id),
                slug: String(item.product.id),
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                category: item.product.category?.slug || 'uncategorized',
                brand: 'Premium',
                images: [item.product.imageURL || ''],
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['Black', 'White', 'Blue'],
                inStock: item.product.stock > 0,
                featured: false,
                trending: false,
                rating: 4.5,
                reviews: 0,
              },
              quantity: item.cartItem.quantity,
              size: item.cartItem.size || '',
              color: item.cartItem.color || '',
            }));
            set({ items });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product, size, color, quantity = 1) => {
        const userId = await getUserId();
        
        if (!userId) {
          // User not authenticated, use local storage only
          set((state) => {
            const existingItem = state.items.find(
              (item) =>
                item.product.id === product.id &&
                item.size === size &&
                item.color === color
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item === existingItem
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }

            return {
              items: [...state.items, { product, quantity, size, color }],
            };
          });
          return;
        }

        // User authenticated, sync with database
        try {
          set({ isLoading: true });
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
            },
            body: JSON.stringify({
              productId: parseInt(product.id),
              quantity,
              size,
              color,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add item');
          }

          // Refresh cart from server
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          // Fallback to local storage on error
          set((state) => {
            const existingItem = state.items.find(
              (item) =>
                item.product.id === product.id &&
                item.size === size &&
                item.color === color
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item === existingItem
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }

            return {
              items: [...state.items, { product, quantity, size, color }],
            };
          });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId, size, color) => {
        const userId = await getUserId();
        
        if (!userId) {
          // User not authenticated, use local storage only
          set((state) => ({
            items: state.items.filter(
              (item) =>
                !(
                  item.product.id === productId &&
                  item.size === size &&
                  item.color === color
                )
            ),
          }));
          return;
        }

        // Find the cart item ID from current state
        const cartItem = get().items.find(
          (item) =>
            item.product.id === productId &&
            item.size === size &&
            item.color === color
        );

        if (!cartItem) return;

        try {
          set({ isLoading: true });
          
          // Fetch cart to get the actual cartItem ID
          const cartResponse = await fetch('/api/cart', {
            headers: { 'x-user-id': userId },
          });
          const cartData = await cartResponse.json();
          
          const apiCartItem = cartData.data.items.find((item: any) =>
            item.product.id === parseInt(productId) &&
            item.cartItem.size === size &&
            item.cartItem.color === color
          );

          if (apiCartItem) {
            const response = await fetch(`/api/cart/items/${apiCartItem.cartItem.id}`, {
              method: 'DELETE',
              headers: { 'x-user-id': userId },
            });

            if (!response.ok) throw new Error('Failed to remove item');
          }

          // Refresh cart from server
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          // Fallback to local storage on error
          set((state) => ({
            items: state.items.filter(
              (item) =>
                !(
                  item.product.id === productId &&
                  item.size === size &&
                  item.color === color
                )
            ),
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId, size, color, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId, size, color);
          return;
        }

        const userId = await getUserId();
        
        if (!userId) {
          // User not authenticated, use local storage only
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === productId &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity }
                : item
            ),
          }));
          return;
        }

        try {
          set({ isLoading: true });
          
          // Fetch cart to get the actual cartItem ID
          const cartResponse = await fetch('/api/cart', {
            headers: { 'x-user-id': userId },
          });
          const cartData = await cartResponse.json();
          
          const apiCartItem = cartData.data.items.find((item: any) =>
            item.product.id === parseInt(productId) &&
            item.cartItem.size === size &&
            item.cartItem.color === color
          );

          if (apiCartItem) {
            const response = await fetch(`/api/cart/items/${apiCartItem.cartItem.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId,
              },
              body: JSON.stringify({ quantity }),
            });

            if (!response.ok) throw new Error('Failed to update quantity');
          }

          // Refresh cart from server
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to update quantity:', error);
          // Fallback to local storage on error
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === productId &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity }
                : item
            ),
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        const userId = await getUserId();
        
        if (!userId) {
          // User not authenticated, use local storage only
          set({ items: [] });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'x-user-id': userId },
          });

          if (!response.ok) throw new Error('Failed to clear cart');

          set({ items: [] });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          // Fallback to local storage on error
          set({ items: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);