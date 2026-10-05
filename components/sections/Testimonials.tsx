'use client';

import { Star, Quote } from 'lucide-react';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';

export interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  result: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const hasRealTestimonials = testimonials && testimonials.length > 0;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-1/3 top-0 h-[300px] w-[300px] bg-purple-600/10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          title="Student Results"
          subtitle={hasRealTestimonials ? undefined : 'Real student stories will appear here once verified.'}
        />

        {hasRealTestimonials ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <Quote className="mb-4 h-6 w-6 text-purple-400/40" />
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={j < t.rating ? 'h-4 w-4 fill-purple-400 text-purple-400' : 'h-4 w-4 text-white/10'}
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t.review}</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                {t.result && (
                  <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs font-medium text-emerald-400">
                    Result: {t.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex justify-center">
            <div className="glass-card max-w-lg rounded-2xl p-10 text-center">
              <div className="mb-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-white/10" />
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Add verified student testimonials here.
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70">
                The component supports avatar, name, role, rating, review, and result fields.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
