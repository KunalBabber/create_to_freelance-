'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles, Cpu } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';

export function AIWorkflow() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-0 top-1/4 h-[350px] w-[350px] bg-emerald-600/10" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="AI Workflow"
          title="Work Smarter With AI"
          subtitle="AI speeds up repetitive work while you control strategy, creativity and quality."
        />

        <div className="mt-12 flex flex-col items-center gap-0">
          {course.aiWorkflow.map((step, i) => (
            <motion.div
              key={step}
              initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col items-center"
            >
              <div
                className={`flex items-center gap-3 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  i === 0 || i === course.aiWorkflow.length - 1
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-300 glow-purple'
                    : 'border-white/10 bg-card/60 text-foreground'
                }`}
              >
                {i === 0 && <Sparkles className="h-4 w-4 text-purple-400" />}
                {i === course.aiWorkflow.length - 1 && <Cpu className="h-4 w-4 text-emerald-400" />}
                <span className="text-xs font-bold text-white/30">{String(i + 1).padStart(2, '0')}</span>
                {step}
              </div>
              {i < course.aiWorkflow.length - 1 && (
                <motion.div
                  initial={reduced ? {} : { opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 32 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 + 0.2 }}
                  className="flex items-center"
                >
                  <ArrowDown className="h-5 w-5 text-purple-500/40" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            AI handles research, ideation, and drafting. You handle strategy, design decisions, and quality control — so every piece of work is both fast and professional.
          </p>
        </div>
      </div>
    </section>
  );
}
