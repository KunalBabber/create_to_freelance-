'use client';

import { Layers } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';

export function ValueStack() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Value Stack"
          title="Everything Included"
          subtitle="One complete creator-to-freelancer system."
        />

        <Stagger className="mt-10 space-y-0" stagger={0.06}>
          {course.valueStack.map((item, i) => (
            <StaggerItem key={item}>
              <div className="group flex items-center gap-4">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
                  <span className="text-sm font-bold text-purple-400">{i + 1}</span>
                </div>
                <div className="flex-1 glass-card rounded-xl px-5 py-3.5 transition-all duration-300 group-hover:border-purple-500/40 group-hover:translate-x-1">
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              </div>
              {i < course.valueStack.length - 1 && (
                <div className="ml-5 h-4 w-px bg-purple-500/20" />
              )}
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
          <Layers className="h-6 w-6 text-purple-400" />
          <p className="text-lg font-bold">Everything Included</p>
          <p className="text-sm text-muted-foreground">One Complete Creator-to-Freelancer System</p>
        </div>
      </div>
    </section>
  );
}
