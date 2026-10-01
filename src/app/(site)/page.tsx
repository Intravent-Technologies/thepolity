'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  Badge,
  Button,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from '@/components/ui';

interface HomepageImages {
  [key: string]: string;
}

/* Image keys are managed from the admin dashboard, so these identifiers are a
   contract — renaming one silently breaks that control. */
const defaultImages: HomepageImages = {
  'hero-visual-1': '/hero-visual-media.svg',
  'hero-visual-2': '/hero-visual-it.svg',
  'hero-visual-3': '/hero-visual-projects.svg',
  'hero-visual-4': '/hero-visual-creative.svg',
  'service-it': '/service-it.svg',
  'service-media': '/service-media.svg',
  'service-project': '/service-project.svg',
  'blog-1': '/blog-creative.svg',
  'blog-2': '/blog-creative.svg',
  'blog-3': '/blog-creative.svg',
};

const SERVICES = [
  {
    title: 'IT Consultancy',
    href: '/services/it-consultancy',
    image: 'service-it',
    description:
      'Technology strategy, systems and support built around how your team actually works — not a generic IT package.',
    points: ['Technology roadmap', 'Cloud & infrastructure', 'Managed support'],
  },
  {
    title: 'Media',
    href: '/services/media',
    image: 'service-media',
    description:
      'Photography, event coverage and visual production that give your organisation a consistent, credible presence.',
    points: ['Photography & portraits', 'Event coverage', 'Photo tourism & visuals'],
  },
  {
    title: 'Project Management',
    href: '/services/project-management',
    image: 'service-project',
    description:
      'Clear scope, honest timelines and steady delivery from kickoff to handover, with the risks surfaced early.',
    points: ['Planning & scoping', 'Delivery oversight', 'Handover & review'],
  },
];

const PRINCIPLES = [
  {
    title: 'Senior attention, always',
    body: 'The person you meet is the person who does the work. Nothing is handed to a junior team or outsourced silently.',
  },
  {
    title: 'Plain language',
    body: 'You get written updates, not jargon. If something slips, you hear it from us before you find out.',
  },
  {
    title: 'Measured on outcomes',
    body: 'We agree what success looks like at the start and report against it, so the work has to earn its place.',
  },
];

const JOURNEY = [
  'Discovery call — no cost, no pitch deck',
  'Written scope, price and timeline',
  'Work begins with a named lead',
  'Handover, plus support if you need it',
];

const FAQS = [
  {
    q: 'What services do you offer?',
    a: 'Three core areas: IT consultancy, media production, and project management. Many engagements combine more than one — the point is the outcome, not which department it lands in.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'It depends entirely on scope. Small pieces of work often run two to three weeks; larger builds run a few months. You get a real timeline in writing before anything starts.',
  },
  {
    q: 'Do you offer revisions?',
    a: 'Yes. Revisions are agreed up front as part of the scope rather than treated as an extra, so there are no surprises at invoicing.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Use the contact form or book a free consultation. We will tell you honestly if we are the wrong fit — that conversation costs you nothing.',
  },
  {
    q: 'Where are you based?',
    a: 'We are in Walsall, West Midlands, and work with clients across the UK. Remote-first delivery is standard, with on-site visits arranged where they add value.',
  },
];

const POSTS = [
  { title: 'The Future of Digital Strategy', category: 'Strategy', date: 'Jan 15, 2025' },
  { title: 'Maximizing ROI with IT Solutions', category: 'Technology', date: 'Jan 10, 2025' },
  { title: 'Building Brands That Last', category: 'Branding', date: 'Jan 5, 2025' },
];

export default function Home() {
  const [images, setImages] = useState<HomepageImages>(defaultImages);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/homepage-images')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: { section: string; imageUrl: string }[]) => {
        if (cancelled || !Array.isArray(data)) return;
        // Slideshow sections now hold several rows. The newest is returned
        // first, so only claim a section once.
        const next: HomepageImages = {};
        for (const item of data) {
          if (!(item.section in next)) next[item.section] = item.imageUrl;
        }
        setImages((prev) => ({ ...prev, ...next }));
      })
      .catch(() => {
        /* fall back to the bundled artwork */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmail('');
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <Section tone="surface" className="pt-16 sm:pt-24 pb-20 sm:pb-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>Strategy · Technology · Media</Eyebrow>

              <h1 className="text-display text-ink mt-6 text-display text-ink">
                One team for the work that decides whether growth actually happens.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
                The Polity brings IT consultancy, media production and project
                management together, so you are not coordinating three
                suppliers to deliver one outcome.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="lg">
                  Book a free consultation
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/portfolio" size="lg" variant="secondary">
                  See our work
                </ButtonLink>
              </div>

              <ul className="mt-12 grid gap-x-8 gap-y-3 border-t border-line pt-8 sm:grid-cols-2">
                {['No discovery fee', 'Written scope before we start', 'Senior-led delivery', 'Based in Walsall, working UK-wide'].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden="true" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {(['hero-visual-1', 'hero-visual-2', 'hero-visual-3', 'hero-visual-4'] as const).map(
                  (key, i) => (
                    <div
                      key={key}
                      className={`overflow-hidden rounded-card border border-line bg-surface-sunken ${
                        i % 2 === 1 ? 'mt-6' : ''
                      }`}
                    >
                      <img
                        src={images[key]}
                        alt=""
                        aria-hidden="true"
                        loading={i < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="aspect-4/5 w-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

  {/* ------------------------------------------------------------- Services */}
      <Section tone="sunken">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Three practices, one point of contact."
            lede="Engage a single service or let them work together. Either way, you deal with one team and one invoice."
          />

          <div className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
            {SERVICES.map((service, i) => (
              <article key={service.title} className="flex flex-col bg-surface p-8">
                <div className="overflow-hidden rounded-card border border-line bg-surface-sunken">
                  <img
                    src={images[service.image]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="aspect-16/10 w-full object-cover"
                  />
                </div>

                <p className="mt-7 text-xs font-semibold tabular tracking-[0.18em] text-ink-subtle">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-title text-ink">{service.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand-500" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors duration-200 hover:text-brand-700"
                >
                  Explore {service.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ Approach */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="How we work"
                title="Straight answers, senior people, no surprises."
                lede="Most of our work comes from clients who were let down somewhere else. That shapes how we operate."
              />

              <ol className="mt-12 space-y-8">
                {PRINCIPLES.map((principle, i) => (
                  <li key={principle.title} className="border-t border-line pt-6">
                    <div className="flex gap-5">
                      <span className="text-xs font-semibold tabular tracking-[0.18em] text-brand-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{principle.title}</h3>
                        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">
                          {principle.body}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-card border border-line bg-surface-sunken p-8 sm:p-10">
                <h3 className="text-title text-ink">What getting started looks like</h3>
                <ol className="mt-8 space-y-5">
                  {JOURNEY.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-xs font-semibold tabular text-ink-muted">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-[0.95rem] leading-relaxed text-ink-muted">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 border-t border-line pt-8">
                  <p className="text-[0.95rem] leading-relaxed text-ink-muted">
                    Based in Walsall, West Midlands. Remote delivery is standard;
                    on-site visits are arranged where they genuinely help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <Section tone="navy" className="py-20 sm:py-24">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow className="text-brand-300">Next step</Eyebrow>
              <h2 className="text-headline text-ink mt-4 text-headline text-ink-inverse">
                Tell us what you are trying to fix.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-inverse/70">
                A short call is usually enough to work out whether we can help.
                If we cannot, we will say so.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <ButtonLink href="/contact" size="lg" variant="inverse">
                Book a consultation
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="tel:+447881168479"
                size="lg"
                variant="ghost"
                className="text-ink-inverse hover:text-white"
              >
                07881 168479
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- FAQ */}
      <Section tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Questions"
            title="The things people ask first."
            align="center"
          />

          <div className="mx-auto mt-14 max-w-3xl border-t border-line">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink transition-colors duration-200 hover:text-brand-600">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="relative size-4 shrink-0 text-ink-subtle transition-transform duration-200 group-open:rotate-45"
                  >
                    <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-ink-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Journal */}
      <Section tone="sunken">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Journal"
              title="Thinking out loud."
              className="max-w-xl"
            />
            <ButtonLink href="/blog" variant="secondary" size="sm">
              All articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {POSTS.map((post, i) => (
              <article key={post.title} className="group">
                <Link href="/blog" className="block">
                  <div className="overflow-hidden rounded-card border border-line bg-surface">
                    <img
                      src={images[`blog-${i + 1}`]}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="aspect-16/10 w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <Badge>{post.category}</Badge>
                    <time className="text-xs tabular text-ink-subtle">{post.date}</time>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-brand-600">
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- Newsletter */}
      <Section tone="surface" className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Keep in touch"
              title="Occasional notes, no noise."
              lede="Roughly once a month, when we have something genuinely worth sending."
              align="center"
            />

            <form onSubmit={handleSubscribe} className="mx-auto mt-10 max-w-md" noValidate>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-full border border-line-strong bg-surface px-5 text-[0.95rem] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/25"
                />
                <Button type="submit" disabled={status === 'loading'} className="shrink-0">
                  {status === 'loading' ? 'Sending…' : 'Subscribe'}
                </Button>
              </div>

              <p aria-live="polite" className="mt-4 min-h-5 text-sm">
                {status === 'success' && (
                  <span className="text-brand-600">Thanks — you are on the list.</span>
                )}
                {status === 'error' && (
                  <span className="text-brand-700">
                    That did not work. Please check the address and try again.
                  </span>
                )}
              </p>
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
