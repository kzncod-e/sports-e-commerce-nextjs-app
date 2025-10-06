'use client';

import { motion } from 'framer-motion';
import { Award, Users, Package, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Customers',
  },
  {
    icon: Package,
    value: '10K+',
    label: 'Products Available',
  },
  {
    icon: Award,
    value: '25+',
    label: 'Premium Brands',
  },
  {
    icon: TrendingUp,
    value: '99%',
    label: 'Satisfaction Rate',
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-12 w-12 mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}