'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { course } from '@/data/course';
import { useCheckout } from '@/components/shared/CTAButton';

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reduced = useReducedMotion();
  const checkout = useCheckout();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const heroHeight = window.innerHeight;
      const nearBottom = window.innerHeight + scrolled >= document.body.scrollHeight - 200;
      setVisible(scrolled > heroHeight * 0.8 && !nearBottom && !dismissed);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="glass border-t border-white/10 p-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Creator to Freelancer</p>
                <p className="text-sm font-bold text-gradient">{course.pricing.salePrice}</p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                data-cta="sticky-mobile"
                onClick={checkout}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-electric-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Get Access
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
