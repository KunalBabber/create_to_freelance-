'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Check, Palette, Instagram, Video, Sparkles,
  FolderOpen, FolderKanban, Layers, TrendingUp,
} from 'lucide-react';
import { course } from '@/data/course';
import { CTAButton } from '@/components/shared/CTAButton';

const chipIcons: Record<string, React.ReactNode> = {
  Canva: <Palette className="h-3.5 w-3.5" />,
  'Video Editing': <Video className="h-3.5 w-3.5" />,
  'Social Media': <Instagram className="h-3.5 w-3.5" />,
  'AI Tools': <Sparkles className="h-3.5 w-3.5" />,
  'Content Creation': <FolderOpen className="h-3.5 w-3.5" />,
  'Freelancing': <FolderKanban className="h-3.5 w-3.5" />,
};

const statIcons: Record<string, React.ReactNode> = {
  Layers: <Layers className="h-4 w-4" />,
  FolderKanban: <FolderKanban className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
};

function FloatingCard({
  children,
  className,
  delay = 0,
  floatClass = 'animate-float',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  floatClass?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${reduced ? '' : floatClass} ${className || ''}`}
    >
      {children}
    </motion.div>
  );
}

function MockupCard({
  title,
  subtitle,
  gradient,
  children,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className={`h-20 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute bottom-2 left-3 text-xs font-semibold text-white/90">{title}</div>
      </div>
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{subtitle}</div>
        {children}
      </div>
    </div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 lg:pt-40">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-20 right-1/4 h-[350px] w-[350px] rounded-full bg-electric-600/15 blur-[100px] animate-pulse-glow"
        aria-hidden="true"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* LEFT */}
          <div className="flex flex-col items-start gap-6">
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
              </span>
              {course.badge}
            </motion.div>

            <motion.h1
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Turn Your Creative Skills
              <br />
              Into a{' '}
              <span className="text-gradient-animated glow-text">Freelance Career.</span>
            </motion.h1>

            <motion.p
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {course.longDescription}
            </motion.p>

            {/* Skill chips */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {course.heroChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-purple-500/40 hover:text-foreground"
                >
                  {chipIcons[chip]}
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <CTAButton location="hero">
                Get Instant Access
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton location="hero-secondary" variant="secondary">
                Explore What You&apos;ll Learn
              </CTAButton>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {course.heroTrust.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT - Floating mockups */}
          <div className="relative hidden h-[520px] lg:block">
            <div className="perspective-1000 relative h-full w-full">
              {/* Main center card */}
              <FloatingCard delay={0.3} className="absolute left-1/2 top-1/2 z-20 w-72 -translate-x-1/2 -translate-y-1/2" floatClass="animate-float">
                <div className="glass-card rounded-2xl p-5 shadow-2xl glow-purple">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <MockupCard title="Canva Design Studio" subtitle="Design Project" gradient="from-purple-600 to-electric-600">
                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-white/10" />
                      <div className="h-2 w-3/4 rounded-full bg-white/10" />
                      <div className="h-2 w-1/2 rounded-full bg-purple-500/40" />
                    </div>
                  </MockupCard>
                </div>
              </FloatingCard>

              {/* Top-left card */}
              <FloatingCard delay={0.5} className="absolute left-0 top-4 z-10 w-56" floatClass="animate-float-slow">
                <div className="glass-card rounded-xl p-3 shadow-xl">
                  <MockupCard title="Instagram Content" subtitle="Social Media" gradient="from-pink-500 to-purple-600">
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      <div className="aspect-square rounded bg-gradient-to-br from-pink-500/60 to-purple-500/60" />
                      <div className="aspect-square rounded bg-gradient-to-br from-purple-500/60 to-electric-500/60" />
                      <div className="aspect-square rounded bg-gradient-to-br from-electric-500/60 to-cyan-500/60" />
                    </div>
                  </MockupCard>
                </div>
              </FloatingCard>

              {/* Top-right card */}
              <FloatingCard delay={0.7} className="absolute right-0 top-12 z-10 w-52" floatClass="animate-float">
                <div className="glass-card rounded-xl p-3 shadow-xl">
                  <MockupCard title="Reels Editing" subtitle="Video Project" gradient="from-electric-600 to-cyan-500">
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-500/30">
                        <Video className="h-4 w-4 text-electric-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-white/10" />
                        <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </MockupCard>
                </div>
              </FloatingCard>

              {/* Bottom-left card */}
              <FloatingCard delay={0.9} className="absolute bottom-8 left-4 z-10 w-52" floatClass="animate-float-slow">
                <div className="glass-card rounded-xl p-3 shadow-xl">
                  <MockupCard title="AI Content Creation" subtitle="AI Workflow" gradient="from-emerald-500 to-electric-500">
                    <div className="mt-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-white/10" />
                        <div className="h-1.5 w-1/2 rounded-full bg-emerald-500/40" />
                      </div>
                    </div>
                  </MockupCard>
                </div>
              </FloatingCard>

              {/* Bottom-right card */}
              <FloatingCard delay={1.1} className="absolute bottom-0 right-2 z-10 w-56" floatClass="animate-float">
                <div className="glass-card rounded-xl p-3 shadow-xl">
                  <MockupCard title="Freelance Portfolio" subtitle="Client Projects" gradient="from-amber-500 to-purple-600">
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-16 rounded-full bg-white/10" />
                        <div className="h-2 w-8 rounded-full bg-amber-500/40" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-20 rounded-full bg-white/10" />
                        <div className="h-2 w-6 rounded-full bg-purple-500/40" />
                      </div>
                    </div>
                  </MockupCard>
                </div>
              </FloatingCard>

              {/* Floating stats */}
              <FloatingCard delay={1.3} className="absolute right-0 top-1/2 z-30" floatClass="animate-float-slow">
                <div className="glass rounded-xl border border-purple-500/30 px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    {statIcons['Layers']}
                    <span className="text-xs font-semibold">6+ Skills</span>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.5} className="absolute left-2 bottom-24 z-30" floatClass="animate-float">
                <div className="glass rounded-xl border border-electric-500/30 px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    {statIcons['TrendingUp']}
                    <span className="text-xs font-semibold">Beginner → Freelancer</span>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={1.7} className="absolute right-8 bottom-32 z-30" floatClass="animate-float-slow">
                <div className="glass rounded-xl border border-emerald-500/30 px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    {statIcons['FolderKanban']}
                    <span className="text-xs font-semibold">Project Based</span>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
