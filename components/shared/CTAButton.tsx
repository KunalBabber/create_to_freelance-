'use client';

import { useCallback } from 'react';
import { course } from '@/data/course';

export function useCheckout() {
  const handleCheckout = useCallback(() => {
    const url = course.checkoutUrl;
    if (url && url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (url && url.startsWith('/')) {
      window.location.href = url;
    } else {
      const event = new CustomEvent('checkout-placeholder', {
        detail: { message: 'Checkout URL not yet configured. Set NEXT_PUBLIC_CHECKOUT_URL to enable purchases.' },
      });
      window.dispatchEvent(event);
    }
  }, []);

  return handleCheckout;
}

export function CTAButton({
  children,
  location,
  variant = 'primary',
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  location: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
}) {
  const checkout = useCheckout();

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', { location });
    }
    if (onClick) {
      onClick();
    } else {
      checkout();
    }
  };

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-gradient-to-r from-purple-600 to-electric-600 text-white px-7 py-3.5 text-base hover:shadow-[0_0_30px_-5px_hsl(263_85%_62%/0.6)] hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'glass-card text-foreground px-7 py-3.5 text-base hover:border-purple-500/50 hover:bg-secondary/40',
    ghost: 'text-muted-foreground hover:text-foreground px-4 py-2 text-sm',
  };

  return (
    <button
      data-cta={location}
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
