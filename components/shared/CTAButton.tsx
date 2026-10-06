'use client';

import { useCallback } from 'react';
import { landingCourse } from '@/data/landing-course';
import { trackAnalyticsEvent } from '@/lib/analytics-client';

export function useCheckout() {
  const handleCheckout = useCallback(() => {
    const url = landingCourse.checkoutUrl;
    if (url && url.startsWith('http')) {
      trackAnalyticsEvent('begin_checkout', {
        currency: 'INR',
        value: 499,
        item_id: 'canva-ai-video-course',
        item_name: 'Canva AI Video Editing Course',
        price: 499,
        quantity: 1,
      });
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
    trackAnalyticsEvent('click_buy', {
      course_name: 'Canva AI Video Editing',
      price: 499,
      currency: 'INR',
      cta_location: location,
    });
    if (onClick) {
      onClick();
    } else {
      checkout();
    }
  };

  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-blue-700 text-white px-7 py-3.5 text-base shadow-sm hover:bg-blue-800',
    secondary:
      'border border-border bg-white text-foreground px-7 py-3.5 text-base hover:bg-slate-50',
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
