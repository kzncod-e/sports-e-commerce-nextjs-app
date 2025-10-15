'use client';

import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Mail, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';

interface SessionData {
  id: string;
  amount_total: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
  payment_status: string;
  status: string;
  line_items?: Array<{
    id: string;
    description: string;
    quantity: number;
    amount_total: number;
    currency: string;
  }>;
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  created: number;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/stripe/session/${sessionId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch session data');
        }

        setSessionData(data.data);
        // Clear cart after successful payment
        clearCart();
      } catch (err: any) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">Loading order details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="bg-destructive/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
            <Package className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Unable to Load Order</h1>
          <p className="text-muted-foreground">{error || 'Something went wrong'}</p>
          <Button asChild>
            <Link href="/products">Return to Shop</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const orderDate = new Date(sessionData.created * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Success Header */}
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="bg-green-500/10 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-bold">Payment Successful!</h1>
                <p className="text-lg text-muted-foreground">
                  Thank you for your purchase, {sessionData.customer_name || 'valued customer'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 inline-flex flex-col sm:flex-row items-center gap-4 bg-muted/50 rounded-lg px-6 py-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-5 w-5" />
                  <p className="text-sm font-medium">
                    Order ID: <span className="text-foreground">{sessionId?.slice(-12).toUpperCase()}</span>
                  </p>
                </div>
                
                <Separator orientation="vertical" className="hidden sm:block h-6" />
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <p className="text-sm">
                    Confirmation sent to <span className="text-foreground">{sessionData.customer_email}</span>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Payment Status */}
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold">Payment Status</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {sessionData.payment_status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{orderDate}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </h2>
                  <div className="space-y-4">
                    {sessionData.line_items?.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className="flex justify-between items-start pb-4 border-b last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">
                            {item.description?.split(' / ')[0] || 'Product'}
                          </p>
                          {item.description?.includes(' / ') && (
                            <p className="text-sm text-muted-foreground">
                              {item.description.split(' / ').slice(1).join(' / ')}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ${(item.amount_total / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${(item.amount_total / 100 / item.quantity).toFixed(2)} each
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Paid</span>
                  <span className="text-2xl">
                    ${(sessionData.amount_total / 100).toFixed(2)} {sessionData.currency.toUpperCase()}
                  </span>
                </div>

                {/* Shipping Info */}
                {sessionData.shipping && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Address
                      </h3>
                      <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
                        <p className="font-medium">{sessionData.shipping.name}</p>
                        <p>{sessionData.shipping.address.line1}</p>
                        {sessionData.shipping.address.line2 && (
                          <p>{sessionData.shipping.address.line2}</p>
                        )}
                        <p>
                          {sessionData.shipping.address.city}, {sessionData.shipping.address.state}{' '}
                          {sessionData.shipping.address.postal_code}
                        </p>
                        <p>{sessionData.shipping.address.country}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  What's Next?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your order is being processed. You'll receive a shipping confirmation
                  email with tracking information once your items are on the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/account">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <p className="text-lg text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}