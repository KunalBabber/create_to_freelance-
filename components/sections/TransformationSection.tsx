'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Reveal } from '@/components/shared/Reveal';

export function TransformationSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-0 top-1/4 h-[350px] w-[350px] bg-electric-600/15" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Transformation"
          title="From Beginner to Freelancer"
          subtitle="See the exact shift you'll make through this program."
        />

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Before */}
          <Reveal>
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-400">
                  Before
                </span>
              </div>
              <ul className="space-y-3">
                {course.transformation.before.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2 py-4 lg:py-0">
            <motion.div
              initial={reduced ? {} : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-electric-600 shadow-lg glow-purple">
                <ArrowRight className="h-6 w-6 text-white lg:rotate-0" />
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                Beginner → Freelancer
              </span>
            </motion.div>
          </div>

          {/* After */}
          <Reveal delay={0.15}>
            <div className="glass-card rounded-2xl border-purple-500/20 p-6 sm:p-8 glow-purple">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  After
                </span>
              </div>
              <ul className="space-y-3">
                {course.transformation.after.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
