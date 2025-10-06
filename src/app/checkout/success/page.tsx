'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Mail } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Order Successful!</h1>
                <p className="text-lg text-muted-foreground">
                  Thank you for your purchase
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Package className="h-5 w-5" />
                  <p className="text-sm">
                    Order #{Math.random().toString(36).substring(2, 11).toUpperCase()}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <p className="text-sm">
                    Confirmation email sent to your inbox
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Your order is being processed. You'll receive a shipping confirmation
                email once your items are on the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/account">View Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}