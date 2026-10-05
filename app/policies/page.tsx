import type { Metadata } from 'next';
import { landingCourse } from '@/data/landing-course';

export const metadata: Metadata = {
  title: `Privacy Policy & Terms | ${landingCourse.name}`,
  description: `Privacy information and purchase terms for ${landingCourse.name}.`,
};

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <nav className="site-container flex h-16 items-center justify-between gap-4" aria-label="Policy navigation">
          <a href="/" className="text-sm font-bold text-slate-900 sm:text-base">{landingCourse.name}</a>
          <a href="/" className="text-sm font-medium text-blue-700 hover:text-blue-900">Back to course</a>
        </nav>
      </header>

      <main className="site-container max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{landingCourse.name}</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Privacy Policy &amp; Terms</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">Please review how checkout works and the terms that apply to this educational course.</p>

        <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-3 text-sm">
          <a href="#privacy" className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">Privacy Policy</a>
          <a href="#terms" className="rounded-md border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">Terms</a>
        </nav>

        <section id="privacy" className="scroll-mt-8 border-b border-slate-200 py-9">
          <h2 className="text-2xl font-bold text-slate-950">Privacy Policy</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">Checkout and payments are handled by Gumroad. When you select a purchase button, you leave this site and use Gumroad&apos;s checkout. Please review <a className="text-blue-700 underline underline-offset-2" href="https://gumroad.com/privacy" target="_blank" rel="noreferrer">Gumroad&apos;s Privacy Policy</a> for how it handles checkout and payment information.</p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
            <p><strong className="text-slate-900">Information you send us:</strong> If you email us, we use the information in your message to respond to your request. Please do not email payment card details or passwords.</p>
            <p><strong className="text-slate-900">Third-party services:</strong> Gumroad processes the purchase. Its own privacy policy and terms apply to information submitted during checkout.</p>
            <p><strong className="text-slate-900">Questions:</strong> Contact <a className="text-blue-700 underline underline-offset-2" href={`mailto:${landingCourse.contactEmail}`}>{landingCourse.contactEmail}</a>.</p>
          </div>
        </section>

        <section id="terms" className="scroll-mt-8 py-9">
          <h2 className="text-2xl font-bold text-slate-950">Terms</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <p><strong className="text-slate-900">Educational purpose:</strong> This course provides educational content and practical learning materials. It is not a promise of employment, business results, or earnings.</p>
            <p><strong className="text-slate-900">No outcome guarantee:</strong> This course is educational only. We do not guarantee a job, clients, or income. Results depend on your skills, effort, experience, market conditions, and other factors outside our control.</p>
            <p><strong className="text-slate-900">Course materials:</strong> Materials are for your personal learning. Do not copy, resell, publish, or redistribute them without written permission.</p>
            <p><strong className="text-slate-900">Price and checkout:</strong> The current course price is {landingCourse.price}. Checkout and payments are handled by Gumroad; review the product details and applicable purchase terms there before paying.</p>
            <p><strong className="text-slate-900">Refunds and access:</strong> Review the refund, access, and delivery details displayed on the Gumroad product page before purchase. Contact us if you need help with course-related questions.</p>
            <p><strong className="text-slate-900">Contact:</strong> <a className="text-blue-700 underline underline-offset-2" href={`mailto:${landingCourse.contactEmail}`}>{landingCourse.contactEmail}</a></p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6">
        <div className="site-container flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <span>&copy; {landingCourse.currentYear} {landingCourse.name}</span>
          <a href="/" className="hover:text-slate-900">Return to course</a>
        </div>
      </footer>
    </div>
  );
}