import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Creator to Freelancer | Canva, Video Editing, AI & Freelancing',
  description:
    'Learn Canva, social media content creation, video editing, AI workflows, portfolio building and client acquisition with a practical creator-to-freelancer roadmap.',
  keywords: [
    'Canva course',
    'video editing course',
    'freelancing course',
    'social media design',
    'AI for creators',
    'content creation',
    'portfolio building',
    'client acquisition',
    'freelance career',
  ],
  openGraph: {
    title: 'Creator to Freelancer | Canva, Video Editing, AI & Freelancing',
    description:
      'Learn Canva, social media content creation, video editing, AI workflows, portfolio building and client acquisition with a practical creator-to-freelancer roadmap.',
    type: 'website',
    siteName: 'Creator to Freelancer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creator to Freelancer | Canva, Video Editing, AI & Freelancing',
    description:
      'Learn Canva, social media content creation, video editing, AI workflows, portfolio building and client acquisition with a practical creator-to-freelancer roadmap.',
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
  name: 'Creator to Freelancer',
  description:
    'Learn Canva, social media content creation, video editing, AI workflows, portfolio building and client acquisition with a practical creator-to-freelancer roadmap.',
  provider: {
    '@type': 'Organization',
    name: 'Creator to Freelancer',
  },
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this course beginner friendly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The course is designed to take you from zero experience to building a professional portfolio and reaching out to clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need previous design experience?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No prior design experience is required. The Canva Mastery module covers everything from the ground up.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long will I have access?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get lifetime access to all course content, including future updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this guarantee freelance income?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The program teaches skills, portfolio building and client acquisition strategies, but freelance results depend on skill development, execution, market conditions and individual effort.',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
