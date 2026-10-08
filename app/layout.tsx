import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CourseAnalyticsTracker } from '@/components/analytics/CourseAnalyticsTracker';
import { AnalyticsRuntime } from '@/components/analytics/AnalyticsRuntime';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  ),
  title: 'GrowLearnix | Canva, AI & Video Editing Course',
  description:
    'A beginner-friendly Hindi and Hinglish course to learn Canva, AI tools, Reels editing, branding and practical portfolio projects. One-time payment ₹499.',
  keywords: [
    'Canva course',
    'video editing course',
    'beginner creative course',
    'Hindi Hinglish course',
    'AI for creators',
    'content creation',
    'creative projects',
    '₹499 course',
  ],
  openGraph: {
    title: 'GrowLearnix | Canva, AI & Video Editing Course',
    description:
      'Learn Canva, AI tools, Reels editing, branding and practical portfolio projects in Hindi and Hinglish for ₹499.',
    type: 'website',
    siteName: 'GrowLearnix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrowLearnix | Canva, AI & Video Editing Course',
    description:
      'A practical Hindi and Hinglish course for beginners. Learn Canva, AI, video editing and build real projects for ₹499.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const courseStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'GrowLearnix',
  description:
    'A beginner-friendly Hindi and Hinglish course to learn Canva, AI tools, Reels editing and practical creative projects.',
  provider: {
    '@type': 'Organization',
    name: 'GrowLearnix',
  },
  offers: { '@type': 'Offer', price: '499', priceCurrency: 'INR' },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this course beginner friendly?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The course is designed for complete beginners.' },
    },
    {
      '@type': 'Question',
      name: 'Which language is used?',
      acceptedAnswer: { '@type': 'Answer', text: 'The course is explained in Hindi and Hinglish.' },
    },
    {
      '@type': 'Question',
      name: 'What will I learn?',
      acceptedAnswer: { '@type': 'Answer', text: 'You will learn Canva, Canva AI tools, Reels/video editing, thumbnail design, branding and practical project creation.' },
    },
    {
      '@type': 'Question',
      name: 'What is the course price?',
      acceptedAnswer: { '@type': 'Answer', text: 'The complete course costs ₹499 as a one-time payment.' },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </head>
      <body className={`${manrope.className} bg-background text-foreground antialiased`}>
        <CourseAnalyticsTracker />
        <AnalyticsRuntime />
        {children}
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
