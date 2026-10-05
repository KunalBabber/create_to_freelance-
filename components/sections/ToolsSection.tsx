'use client';

import { Palette, Video, Sparkles, Layout, Briefcase, type LucideIcon } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';

const categoryIcons: Record<string, LucideIcon> = {
  Design: Palette,
  Video: Video,
  AI: Sparkles,
  Productivity: Layout,
  Freelancing: Briefcase,
};

export function ToolsSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Tools You'll Master"
          title="Master the Tools Real Freelancers Use"
          subtitle="Hands-on training with the most in-demand creative and freelance tools."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
          {course.tools.map((tool) => {
            const Icon = categoryIcons[tool.category] || Layout;
            return (
              <StaggerItem key={tool.category}>
                <div className="glass-card h-full rounded-2xl p-5 transition-all duration-300 hover:border-purple-500/30">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {tool.items.map((item) => (
                      <li key={item} className="text-sm text-foreground/80">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
