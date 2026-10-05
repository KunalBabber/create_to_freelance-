'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';

export function CheckoutPlaceholder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        setShow(true);
      }
    };
    window.addEventListener('checkout-placeholder', handler);
    return () => window.removeEventListener('checkout-placeholder', handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 px-4"
        >
          <div className="glass-card flex items-center gap-3 rounded-xl p-4 shadow-2xl max-w-sm">
            <Info className="h-5 w-5 shrink-0 text-purple-400" />
            <p className="flex-1 text-sm text-muted-foreground">
              Checkout coming soon. Set <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-foreground">NEXT_PUBLIC_CHECKOUT_URL</code> to enable purchases.
            </p>
            <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
