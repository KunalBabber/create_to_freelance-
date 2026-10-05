'use client';

import { ShieldCheck } from 'lucide-react';
import { course } from '@/data/course';

export function Guarantee() {
  if (!course.guarantee.enabled) {
    return null;
  }

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col items-center gap-4 rounded-2xl border-emerald-500/20 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold">{course.guarantee.heading}</h3>
          {course.guarantee.body && (
            <p className="text-sm leading-relaxed text-muted-foreground">{course.guarantee.body}</p>
          )}
        </div>
      </div>
    </section>
  );
}
