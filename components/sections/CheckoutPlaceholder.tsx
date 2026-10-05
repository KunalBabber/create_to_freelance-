'use client';

import { useEffect, useState } from 'react';
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

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 px-4" role="status">
      <div className="flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
        <Info className="h-5 w-5 shrink-0 text-blue-700" />
        <p className="flex-1 text-sm text-slate-600">
          Checkout is unavailable. Set <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-900">NEXT_PUBLIC_CHECKOUT_URL</code> to enable purchases.
        </p>
        <button onClick={() => setShow(false)} className="text-slate-500 hover:text-slate-900" aria-label="Dismiss checkout notice">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
