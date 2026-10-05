'use client';

import { useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { course } from '@/data/course';

export function SocialProof() {
  const reduced = useReducedMotion();
  const items = [...course.socialProof, ...course.socialProof];

  return (
    <section className="relative border-y border-white/5 bg-card/30 py-6">
      <div className="mx-auto max-w-7xl overflow-hidden px-4">
        <div
          className={`flex gap-8 ${reduced ? '' : 'animate-marquee'}`}
          style={{ width: 'max-content' }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <Check className="h-4 w-4 text-purple-400" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
