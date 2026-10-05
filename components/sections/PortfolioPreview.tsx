'use client';

import { ArrowRight, Monitor, Smartphone } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';
import { CTAButton } from '@/components/shared/CTAButton';

function BrowserMock({ title, type, index }: { title: string; type: string; index: number }) {
  const gradients = [
    'from-purple-600/30 to-electric-600/30',
    'from-pink-500/30 to-purple-600/30',
    'from-electric-600/30 to-cyan-500/30',
    'from-emerald-500/30 to-electric-500/30',
    'from-amber-500/30 to-purple-600/30',
  ];
  const grad = gradients[index % gradients.length];

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* Browser bar */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        </div>
        <div className="ml-2 flex-1 truncate rounded-md bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">
          creatortofreelancer.com/portfolio
        </div>
      </div>
      {/* Content */}
      <div className={`relative h-40 bg-gradient-to-br ${grad} p-4`}>
        <div className="absolute inset-0 bg-dots opacity-15" />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {type}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <div className="mt-2 flex gap-1.5">
              <div className="h-1.5 w-12 rounded-full bg-white/30" />
              <div className="h-1.5 w-8 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioPreview() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-1/3 top-1/3 h-[300px] w-[300px] bg-electric-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Portfolio Preview"
          title="You'll Finish With Work You Can Actually Show Clients"
          subtitle="Build a professional portfolio with real project mockups that demonstrate your skills."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {course.portfolioPreviews.map((preview, i) => (
            <StaggerItem key={preview.title}>
              <BrowserMock title={preview.title} type={preview.type} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Monitor className="h-4 w-4" /> Desktop layouts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Smartphone className="h-4 w-4" /> Mobile previews
            </span>
          </div>
          <CTAButton location="portfolio" variant="secondary">
            Build Your Portfolio
            <ArrowRight className="h-4 w-4" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
