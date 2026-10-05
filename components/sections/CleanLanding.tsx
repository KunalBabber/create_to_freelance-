import Image from 'next/image';
import { Check, ChevronDown, Menu } from 'lucide-react';
import { landingCourse } from '@/data/landing-course';
import { CTAButton } from '@/components/shared/CTAButton';
import { LeadResources } from '@/components/sections/LeadResources';

const included = [
  '6+ Detailed Modules',
  'Real-World Projects',
  'Canva AI Tools',
  'Reels & Video Editing',
  'Thumbnail Design',
  'Branding Projects',
  'Portfolio-Ready Work',
  'Beginner Friendly',
  'Hindi + Hinglish Explanation',
];

const pricingFeatures = [
  '6+ Detailed Modules',
  'Real-World Projects',
  'Canva AI Tools',
  'Video Editing',
  'Branding Projects',
  'Portfolio Work',
  'Hindi + Hinglish',
  'Beginner Friendly',
];

const faqs = [
  { question: 'Is this course beginner friendly?', answer: 'Yes. The course is designed for complete beginners.' },
  { question: 'Which language is used?', answer: 'The course is explained in Hindi and Hinglish.' },
  { question: 'What will I learn?', answer: 'You will learn Canva, Canva AI tools, Reels/video editing, thumbnail design, branding and practical project creation.' },
  { question: 'What is the course price?', answer: `The complete course costs ${landingCourse.price} as a one-time payment.` },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <nav className="site-container flex h-16 items-center justify-between gap-3" aria-label="Main navigation">
        <a href="#top" className="shrink-0 text-sm font-bold text-slate-900 sm:text-base">{landingCourse.name}</a>
        <div className="hidden items-center gap-7 md:flex">
          <a href="#included" className="text-sm font-medium text-slate-600 hover:text-slate-950">What&apos;s Included</a>
          <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-950">FAQ</a>
          <CTAButton location="navbar" className="px-5 py-2.5 text-sm">Buy Now</CTAButton>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <details className="mobile-menu relative">
            <summary aria-label="Open navigation menu" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-slate-200 text-slate-800 [&::-webkit-details-marker]:hidden">
              <Menu className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <a href="#included" className="block rounded-md px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">What&apos;s Included</a>
              <a href="#faq" className="block rounded-md px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">FAQ</a>
              <CTAButton location="navbar-mobile" className="mt-2 w-full px-3 py-2.5 text-sm">Buy Now</CTAButton>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="site-container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div className="max-w-xl">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800">BEGINNER FRIENDLY COURSE</span>
        <h1 className="mt-5 text-4xl font-bold leading-[1.08] text-slate-950 sm:text-5xl">Learn Creative Skills That Actually Get You Started</h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">A practical Hindi/Hinglish course designed for beginners who want to learn Canva, Reels editing, thumbnail design, branding and portfolio creation.</p>
        <div className="mt-7 flex items-end gap-3">
          <span className="text-4xl font-bold leading-none text-slate-950">{landingCourse.price}</span>
          <span className="pb-0.5 text-sm text-slate-500">One-Time Payment</span>
        </div>
        <CTAButton location="hero" className="mt-5 w-full sm:w-auto">Buy Course – {landingCourse.price}</CTAButton>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          {['Beginner Friendly', 'Hindi + Hinglish', 'Practical Learning'].map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-blue-700" aria-hidden="true" />{item}</li>
          ))}
        </ul>
      </div>
      <div className="hero-banner">
        <Image
          src="/images/canva-creator-freelancer.png"
          alt="Design with Canva: social media posts, video, Reels, carousel designs, and Canva AI"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
          className="object-contain"
        />
      </div>
    </section>
  );
}

function Included() {
  return (
    <section id="included" className="site-section border-y border-slate-200 bg-slate-50">
      <div className="site-container">
        <h2 className="section-heading text-center">What&apos;s Included</h2>
        <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item) => (
            <li key={item} className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700"><Check className="h-4 w-4" aria-hidden="true" /></span>
              <span className="text-sm font-medium text-slate-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: 'Canva Design',
      image: '/images/canva-design.jpg',
      alt: 'Desktop screen showing a graphic design editor',
    },
    {
      title: 'Reels & Video Editing',
      image: '/images/video-editing.jpg',
      alt: 'Video editor timeline with a multi-track project open on screen',
    },
    {
      title: 'Branding & Portfolio',
      image: '/images/branding-portfolio.jpg',
      alt: 'Laptop and phone displaying a portfolio design presentation',
    },
  ];

  return (
    <section className="site-section">
      <div className="site-container">
        <div className="text-center">
          <h2 className="section-heading">Learn By Doing</h2>
          <p className="section-copy mx-auto">Learn practical skills and create real projects you can add to your portfolio.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="preview-stage">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="px-4 py-4 text-sm font-semibold text-slate-900">{project.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="site-section border-y border-slate-200 bg-slate-50">
      <div className="site-container max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.04] sm:p-10">
          <div className="text-center">
            <h2 className="section-heading">Get Complete Course Access</h2>
            <p className="mt-6 text-5xl font-bold text-slate-950">{landingCourse.price}</p>
            <p className="mt-2 text-sm text-slate-500">One-Time Payment</p>
          </div>
          <ul className="mx-auto mt-8 grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {pricingFeatures.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm text-slate-800"><Check className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />{item}</li>)}
          </ul>
          <div className="mx-auto mt-8 max-w-md"><CTAButton location="pricing" className="w-full py-4 text-base">Buy Now – {landingCourse.price}</CTAButton></div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="site-section">
      <div className="site-container max-w-3xl">
        <h2 className="section-heading text-center">Frequently Asked Questions</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden sm:text-base">
                {question}<ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="max-w-2xl pt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-y border-blue-100 bg-blue-50 py-12 sm:py-14">
      <div className="site-container flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold leading-tight text-slate-950">Start Learning Today</h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Learn practical creative skills and build portfolio-ready projects.</p>
        <p className="mt-5 text-3xl font-bold text-slate-950">{landingCourse.price}</p>
        <CTAButton location="final" className="mt-4">Buy Course – {landingCourse.price}</CTAButton>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-7">
      <div className="site-container flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <span className="text-sm font-semibold text-slate-900">{landingCourse.name}</span>
        <nav aria-label="Footer links" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <a href="/policies#privacy" className="hover:text-slate-950">Privacy Policy</a>
          <a href="/policies#terms" className="hover:text-slate-950">Terms</a>
          <a href={`mailto:${landingCourse.contactEmail}`} className="hover:text-slate-950">Contact</a>
        </nav>
        <p className="text-xs text-slate-500">&copy; {landingCourse.currentYear} {landingCourse.name}</p>
      </div>
    </footer>
  );
}

export function CleanLanding() {
  return <><Navbar /><main><Hero /><Included /><Projects /><LeadResources /><Pricing /><FAQ /><FinalCTA /></main><Footer /></>;
}