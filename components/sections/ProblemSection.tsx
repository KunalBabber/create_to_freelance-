'use client';

import { ArrowRight } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/Reveal';
import { GlowOrb } from '@/components/shared/SectionHeading';

export function ProblemSection() {
  return (
    <section id="overview" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="-left-20 top-1/3 h-[300px] w-[300px] bg-purple-600/15" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="The Problem"
          title="Watching Tutorials Isn't Building Your Career."
          subtitle="Most beginners jump between random Canva tutorials, editing videos and AI tools without knowing how those skills turn into paid work."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {course.problems.map((p) => (
            <StaggerItem key={p.num}>
              <div className="group glass-card h-full rounded-2xl p-6 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/5">
                <div className="mb-4 text-3xl font-bold text-white/10 transition-colors group-hover:text-red-400/30">
                  {p.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-6">
          <p className="text-center text-lg font-semibold">
            This course connects all four pieces.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {course.problemFlow.map((step, i) => (
              <div key={step} className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-400">
                  {step}
                </span>
                {i < course.problemFlow.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
