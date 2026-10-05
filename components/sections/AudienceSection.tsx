'use client';

import { Check, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Reveal } from '@/components/shared/Reveal';

export function AudienceSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-0 top-1/3 h-[300px] w-[300px] bg-electric-600/10" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Who This Is For"
          title="Is This Course Right for You?"
          subtitle="Be honest about where you are and where you want to go."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Perfect for */}
          <Reveal>
            <div className="glass-card h-full rounded-2xl border-emerald-500/20 p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <ThumbsUp className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Perfect For</h3>
              </div>
              <ul className="space-y-3">
                {course.audience.perfectFor.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Not for */}
          <Reveal delay={0.15}>
            <div className="glass-card h-full rounded-2xl border-red-500/20 p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                  <ThumbsDown className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold">Not For</h3>
              </div>
              <ul className="space-y-3">
                {course.audience.notFor.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <X className="h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
