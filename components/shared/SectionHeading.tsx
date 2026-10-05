'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SectionHeading({
  badge,
  title,
  subtitle,
  className,
  align = 'center',
}: {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'center' | 'left';
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {badge && (
        <motion.span
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={reduced ? {} : { opacity: 0, y: 20 }}
        whileInView={reduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full opacity-30 blur-[100px]',
        className
      )}
      aria-hidden="true"
    />
  );
}
