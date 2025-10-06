'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Stay in the Game
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Subscribe to get exclusive deals, early access to new products, and
              expert training tips delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>

            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400"
              >
                ✓ Thanks for subscribing! Check your inbox for a welcome offer.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}