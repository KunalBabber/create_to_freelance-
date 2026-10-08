import Image from 'next/image';
import { BookOpen, Check, CheckCircle2, ChevronDown, Menu, Play, Sparkles } from 'lucide-react';
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
      <div className="relative mx-auto w-full max-w-xl lg:justify-self-end">
        <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-200/60 via-indigo-100/40 to-cyan-100/50 blur-2xl" />
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-3 shadow-2xl shadow-blue-900/15 sm:p-4">
          <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Your learning dashboard</p>
                <p className="mt-2 text-xl font-bold">Creative Skills Course</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4 rounded-2xl bg-white/10 p-4">
              <div>
                <p className="text-xs text-slate-300">Course progress</p>
                <p className="mt-1 text-2xl font-bold">82%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-blue-500 border-r-blue-200 text-xs font-bold">82%</div>
            </div>
          </div>

          <div className="grid gap-3 p-2 sm:grid-cols-2 sm:p-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700"><BookOpen className="h-5 w-5" aria-hidden="true" /></div>
                <div><p className="text-sm font-semibold text-slate-900">9 modules</p><p className="text-xs text-slate-500">Complete your journey</p></div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-4/5 rounded-full bg-blue-700" /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></div>
                <div><p className="text-sm font-semibold text-slate-900">Portfolio projects</p><p className="text-xs text-slate-500">Build real work</p></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" aria-hidden="true" /> Ready to create</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-3 py-4 sm:px-4">
            <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-700 text-white"><Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" /></div><div><p className="text-sm font-semibold text-slate-900">Continue learning</p><p className="text-xs text-slate-500">Start your next lesson</p></div></div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Next lesson</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:block">
          <p className="text-xs font-semibold text-slate-500">Practical projects</p>
          <p className="mt-0.5 text-sm font-bold text-slate-900">Build. Share. Grow.</p>
        </div>
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