'use client';

import {
  FileText, Mail, CheckSquare, Calendar, UserPlus,
  Sparkles, Calculator, List, type LucideIcon,
} from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';

const iconMap: Record<string, LucideIcon> = {
  FileText, Mail, CheckSquare, Calendar, UserPlus, Sparkles, Calculator, List,
};

export function Bonuses() {
  return (
    <section id="bonuses" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-0 top-1/4 h-[300px] w-[300px] bg-purple-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Bonuses"
          title="Everything You Need to Start Faster"
          subtitle="8 ready-to-use templates, checklists, and resources included with your enrollment."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {course.bonuses.map((bonus) => {
            const Icon = iconMap[bonus.icon] || Sparkles;
            return (
              <StaggerItem key={bonus.num}>
                <div className="group glass-card h-full rounded-2xl p-5 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-electric-600/20 border border-purple-500/20">
                      <Icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-white/10 group-hover:text-purple-400/30">
                      {bonus.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">{bonus.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Bonus Resource</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Bundle graphic */}
        <div className="mt-12 flex justify-center">
          <div className="glass-card relative flex items-center gap-4 rounded-2xl p-6 glow-purple">
            <div className="flex -space-x-3">
              {course.bonuses.slice(0, 5).map((b, i) => {
                const Icon = iconMap[b.icon] || Sparkles;
                return (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-card bg-gradient-to-br from-purple-600/30 to-electric-600/30"
                  >
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                );
              })}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-card bg-white/5 text-xs font-bold">
                +3
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">8 Bonus Resources Included</p>
              <p className="text-xs text-muted-foreground">Templates, scripts, checklists & more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
