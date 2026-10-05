'use client';

import { Check, Star } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';
import { cn } from '@/lib/utils';

const tierStyles: Record<number, string> = {
  1: 'border-white/10',
  2: 'border-purple-500/30',
  3: 'border-purple-500/50 glow-purple',
};

export function ServicePackages() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="right-1/4 top-0 h-[300px] w-[300px] bg-electric-600/10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Service Packages"
          title="Turn Skills Into Sellable Services"
          subtitle="See how your new skills can be packaged into freelance offerings. These are example packages — not guaranteed income."
        />

        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            Example service packages — results vary by individual
          </span>
        </div>

        <Stagger className="mt-6 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {course.servicePackages.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <div className={cn('glass-card h-full rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/40', tierStyles[pkg.tier])}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{pkg.name}</h3>
                  {pkg.tier === 3 && (
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />
                      ))}
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
