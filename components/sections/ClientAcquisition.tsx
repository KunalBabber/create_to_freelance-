'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Linkedin, Instagram, Mail, Globe, Users } from 'lucide-react';
import { course } from '@/data/course';
import { SectionHeading, GlowOrb } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  'New Lead': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  Contacted: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  'Follow Up': 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  'Call Booked': 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  'Proposal Sent': 'border-electric-500/30 bg-electric-500/10 text-electric-400',
  Won: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
};

const channelIcons: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  'Cold Email': <Mail className="h-4 w-4" />,
  Upwork: <Globe className="h-4 w-4" />,
  Fiverr: <Globe className="h-4 w-4" />,
  Referrals: <Users className="h-4 w-4" />,
};

export function ClientAcquisition() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GlowOrb className="left-0 top-1/3 h-[300px] w-[300px] bg-purple-600/12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Client Acquisition"
          title="Skills Are Only Valuable When You Can Sell Them."
          subtitle="Learn a systematic approach to finding, contacting, and closing freelance clients."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Dashboard mock */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden rounded-2xl"
          >
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Client Acquisition Dashboard</h3>
                <span className="text-xs text-muted-foreground">Example view</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-3 font-medium">Lead</th>
                    <th className="p-3 font-medium">Platform</th>
                    <th className="p-3 font-medium">Service</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {course.clientLeads.map((lead, i) => (
                    <motion.tr
                      key={i}
                      initial={reduced ? {} : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="p-3 font-medium">{lead.lead}</td>
                      <td className="p-3 text-muted-foreground">{lead.platform}</td>
                      <td className="p-3 text-muted-foreground">{lead.service}</td>
                      <td className="p-3">
                        <span className={cn('inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold', statusColors[lead.status])}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-emerald-400">{lead.value}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Channels */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="mb-1 text-sm font-semibold">Acquisition Channels</h3>
            <p className="mb-5 text-xs text-muted-foreground">Where to find and reach clients</p>
            <div className="grid grid-cols-2 gap-3">
              {course.acquisitionChannels.map((channel) => (
                <div
                  key={channel}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/5"
                >
                  <span className="text-purple-400">{channelIcons[channel]}</span>
                  <span className="text-sm font-medium">{channel}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
