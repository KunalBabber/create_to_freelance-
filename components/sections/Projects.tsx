'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { Stagger, StaggerItem } from '@/components/shared/Reveal';

export function Projects() {
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-0 top-1/4 h-[300px] w-[300px] bg-electric-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Project-Based Learning"
          title="Don't Just Watch. Build."
          subtitle="Every module includes real projects you can add to your portfolio and show potential clients."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {course.projects.map((project, i) => (
            <StaggerItem key={project.title}>
              <motion.div
                whileHover={reduced ? {} : { y: -6 }}
                transition={{ duration: 0.2 }}
                className="group glass-card h-full overflow-hidden rounded-2xl"
              >
                {/* Visual preview */}
                <div className={`relative h-40 bg-gradient-to-br ${project.color} overflow-hidden`}>
                  <div className="absolute inset-0 bg-dots opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white/20">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {project.tag}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/30 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold">{project.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Portfolio Project</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
