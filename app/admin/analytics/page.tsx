import type { Metadata } from 'next';
import { AdminAnalyticsDashboard } from '@/components/analytics/AdminAnalyticsDashboard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Analytics Dashboard | GrowLearnix' };

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsDashboard />;
}