'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { course } from '@/data/course';
import { CTAButton } from '@/components/shared/CTAButton';

export function FinalCTA() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-15" aria-hidden="true" />
      <motion.div
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-conic from-purple-600/20 via-electric-600/20 to-transparent opacity-40 blur-[80px]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[100px] animate-pulse-glow" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.span
            initial={reduced ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400"
          >
            {course.finalCta.label}
          </motion.span>

          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          >
            Stop Collecting Tutorials.
            <br />
            <span className="text-gradient-animated">Start Building Skills You Can Sell.</span>
          </motion.h2>

          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            {course.finalCta.subtext}
          </motion.p>

          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2"
          >
            <CTAButton location="final" className="px-8 py-4 text-base">
              {course.finalCta.cta}
              <ArrowRight className="h-5 w-5" />
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
