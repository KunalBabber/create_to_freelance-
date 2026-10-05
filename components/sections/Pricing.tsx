'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Zap, ArrowRight, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { CTAButton } from '@/components/shared/CTAButton';

function useCountdown(target: string | null) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, active: false });

  useEffect(() => {
    if (!target) return;
    const targetDate = new Date(target).getTime();
    const update = () => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTime({ hours: 0, minutes: 0, seconds: 0, active: false });
        return;
      }
      setTime({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        active: true,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return time;
}

export function Pricing() {
  const reduced = useReducedMotion();
  const countdown = useCountdown(course.pricing.promoExpiry);
  const hasPromo = course.pricing.promoExpiry && countdown.active;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-1/4 top-0 h-[400px] w-[400px] bg-purple-600/15" />
      <GlowOrb className="right-1/4 bottom-0 h-[300px] w-[300px] bg-electric-600/10" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Start Your Creator → Freelancer Journey"
          subtitle="One payment. Lifetime access. Everything included."
        />

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 overflow-hidden rounded-3xl"
        >
          <div className="glass-card relative rounded-3xl border-purple-500/30 p-8 sm:p-10 glow-purple">
            {/* Glow accent */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[80px]" />

            <div className="relative">
              {/* Header */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold">{course.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Complete Creator-to-Freelancer System</p>
              </div>

              {/* Price */}
              <div className="mb-6 flex flex-col items-center gap-2">
                <div className="flex items-baseline gap-3">
                  {course.pricing.originalPrice !== course.pricing.salePrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {course.pricing.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gradient">
                    {course.pricing.salePrice}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">One-time payment · Lifetime access</p>
              </div>

              {/* Promo countdown */}
              <AnimatePresence>
                {hasPromo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-sm"
                  >
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400">Offer ends in</span>
                    <span className="font-mono font-semibold text-foreground">
                      {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features */}
              <div className="mb-8 grid gap-2.5 sm:grid-cols-2">
                {course.pricingFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <CTAButton location="pricing" className="w-full py-4 text-base">
                Get Instant Access
                <ArrowRight className="h-5 w-5" />
              </CTAButton>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {course.pricingTrust.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    {item === 'Secure Checkout' && <Lock className="h-3.5 w-3.5" />}
                    {item === 'Instant Access' && <Zap className="h-3.5 w-3.5" />}
                    {item === 'Lifetime Learning' && <Check className="h-3.5 w-3.5" />}
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
