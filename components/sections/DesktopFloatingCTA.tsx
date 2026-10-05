'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCheckout } from '@/components/shared/CTAButton';

export function DesktopFloatingCTA() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const checkout = useCheckout();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const heroHeight = window.innerHeight;
      const nearBottom = window.innerHeight + scrolled >= document.body.scrollHeight - 300;
      setVisible(scrolled > heroHeight && !nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-30 hidden lg:block"
        >
          <button
            data-cta="floating-desktop"
            onClick={checkout}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-electric-600 px-6 py-3.5 text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_hsl(263_85%_62%/0.6)]"
          >
            Get Instant Access
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
