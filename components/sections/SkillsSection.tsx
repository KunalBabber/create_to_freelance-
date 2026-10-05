'use client';

import {
  Palette, Instagram, Video, Sparkles, Briefcase, FolderOpen,
  type LucideIcon,
} from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';

const iconMap: Record<string, LucideIcon> = {
  Palette, Instagram, Video, Sparkles, Briefcase, FolderOpen,
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-1/4 top-0 h-[300px] w-[300px] bg-purple-600/12" />
      <GlowOrb className="right-1/4 bottom-0 h-[300px] w-[300px] bg-electric-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Skills You'll Learn"
          title="Everything You Need to Become Client-Ready"
          subtitle="Six core skill areas that take you from creative beginner to confident freelancer."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {course.skills.map((skill) => {
            const Icon = iconMap[skill.icon] || Sparkles;
            return (
              <StaggerItem key={skill.num}>
                <div className="group glass-card h-full rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-[0_0_30px_-10px_hsl(263_85%_62%/0.4)]">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-electric-600/20 border border-purple-500/20">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-white/10 transition-colors group-hover:text-purple-400/30">
                      {skill.num}
                    </span>
                  </div>
                  <h3 className="mb-4 text-lg font-semibold">{skill.title}</h3>
                  <ul className="space-y-2">
                    {skill.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-electric-500" />
                        {point}
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
