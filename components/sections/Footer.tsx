'use client';

import { Zap, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { course } from '@/data/course';

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-electric-600">
                <Zap className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="text-sm font-bold">Creator to Freelancer</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {course.description}
            </p>
            <div className="flex gap-2">
              {[Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-purple-500/40 hover:text-foreground"
                  aria-label="Social link placeholder"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Course</h4>
            <ul className="space-y-2.5">
              <li><a href={course.footerLinks.course} className="text-xs text-muted-foreground hover:text-foreground">Overview</a></li>
              <li><a href={course.footerLinks.curriculum} className="text-xs text-muted-foreground hover:text-foreground">Curriculum</a></li>
              <li><a href={course.footerLinks.faq} className="text-xs text-muted-foreground hover:text-foreground">FAQ</a></li>
              <li><a href={course.footerLinks.contact} className="text-xs text-muted-foreground hover:text-foreground">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href={course.footerLinks.privacy} className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href={course.footerLinks.terms} className="text-xs text-muted-foreground hover:text-foreground">Terms</a></li>
              <li><a href={course.footerLinks.refund} className="text-xs text-muted-foreground hover:text-foreground">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <a href={`mailto:${course.contact.email}`} className="text-xs text-muted-foreground hover:text-foreground">
              {course.contact.email}
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-white/5 pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground/60">
            {course.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {course.currentYear} Creator to Freelancer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
