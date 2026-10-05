'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';

export function FreelanceRoadmap() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-1/4 top-0 h-[300px] w-[300px] bg-purple-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Roadmap"
          title="From Learning to Getting Paid"
          subtitle="Follow the exact 11-step path from your first lesson to repeat freelance clients."
        />

        {/* Desktop: horizontal connected roadmap */}
        <div className="mt-14 hidden lg:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-purple-600/40 via-electric-600/40 to-purple-600/40" />
            <div className="grid grid-cols-6 gap-4">
              {course.roadmap.map((step, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                return (
                  <motion.div
                    key={i}
                    initial={reduced ? {} : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative flex flex-col items-center"
                    style={{ marginTop: row * 80 }}
                  >
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-500/40 bg-card text-sm font-bold text-purple-400">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="mt-3 rounded-lg border border-white/10 bg-card/50 px-3 py-2 text-center">
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: vertical roadmap */}
        <div className="mt-10 lg:hidden">
          <div className="relative space-y-0">
            {course.roadmap.map((step, i) => (
              <motion.div
                key={i}
                initial={reduced ? {} : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative flex items-center gap-4 pb-8"
              >
                {i < course.roadmap.length - 1 && (
                  <div className="absolute left-[23px] top-12 h-full w-0.5 bg-gradient-to-b from-purple-500/40 to-transparent" />
                )}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-purple-500/40 bg-card text-sm font-bold text-purple-400">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 rounded-lg border border-white/10 bg-card/50 px-4 py-3">
                  <span className="text-sm font-medium">{step}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-emerald-400" />
          Each step builds on the previous one
        </div>
      </div>
    </section>
  );
}
