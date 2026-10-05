'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { CTAButton } from '@/components/shared/CTAButton';
import { cn } from '@/lib/utils';

function ModuleItem({ num, title, lessons }: { num: string; title: string; lessons: string[] }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        'glass-card rounded-2xl transition-all duration-300',
        open && 'border-purple-500/40 bg-purple-500/5'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-electric-600/20 border border-purple-500/20 text-sm font-bold text-purple-400">
            {num}
          </span>
          <div>
            <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{lessons.length} lessons</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
        >
          <Plus className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 p-5 pt-4 sm:p-6">
              <ul className="grid gap-2 sm:grid-cols-2">
                {lessons.map((lesson) => (
                  <li key={lesson} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-purple-400/60" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Curriculum() {
  return (
    <section id="curriculum" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-0 top-1/3 h-[350px] w-[350px] bg-purple-600/12" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Curriculum"
          title="Your Step-by-Step Roadmap"
          subtitle="10 modules covering everything from creative foundations to freelance growth."
        />

        <div className="mt-10 space-y-3">
          {course.modules.map((mod) => (
            <ModuleItem key={mod.num} num={mod.num} title={mod.title} lessons={mod.lessons} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}+ lessons across 10 modules
          </p>
          <CTAButton location="curriculum">
            Get Instant Access
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
