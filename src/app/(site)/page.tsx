import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  Badge,
  ButtonLink,
  CategoryLabel,
  Container,
  Eyebrow,
  NumberedRow,
  Section,
  SectionHeading,
} from '@/components/ui';
import PhotoHero from '@/components/PhotoHero';
import PhotoMarquee from '@/components/PhotoMarquee';
import { getHomepageImages, getWorkAlbumMedia, getWorkAlbums } from '@/lib/storage';
import {
  ALBUM_COVER_WIDTH,
  ALBUM_GRID_WIDTHS,
  drivePhotoSrcSet,
  drivePhotoUrl,
} from '@/lib/work-types';

/* Image keys are managed from the admin dashboard, so these identifiers are a
   contract — renaming one silently breaks that control. */
const defaultImages: Record<string, string> = {
  'hero-visual-1': '/hero-visual-media.jpg',
  'hero-visual-2': '/hero-visual-it.jpg',
  'hero-visual-3': '/hero-visual-projects.jpg',
  'hero-visual-4': '/hero-visual-creative.jpg',
  'service-it': '/service-it.jpg',
  'service-media': '/service-media.jpg',
  'service-project': '/service-project.jpg',
  'blog-1': '/blog-1.jpg',
  'blog-2': '/blog-2.jpg',
  'blog-3': '/blog-3.jpg',
};

const SERVICES = [
  {
    label: 'IT Consultancy',
    href: '/services/it-consultancy',
    image: 'service-it',
    description:
      'Technology strategy, systems and support built around how your team actually works — not a generic IT package.',
    points: ['Technology roadmap', 'Cloud & infrastructure', 'Managed support'],
  },
  {
    label: 'Media',
    href: '/services/media',
    image: 'service-media',
    description:
      'Photography, event coverage and visual production that give your organisation a consistent, credible presence.',
    points: ['Photography & portraits', 'Event coverage', 'Photo tourism & visuals'],
  },
  {
    label: 'Project Management',
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

const PROOF_POINTS = [
  { value: '10+', label: 'Years combined practice experience' },
  { value: 'UK', label: 'Wide, nationwide client base' },
  { value: '3', label: 'Practices under one roof' },
  { value: '0', label: 'Discovery fees' },
];

/* Widths a hero needs. Wider than the album grid so it stays sharp on a large
   display without offering the browser choices it will never pick. */
const HERO_WIDTHS = [1200, 1920, 2560] as const;

export default async function Home() {
  const [homepageImages, albums] = await Promise.all([
    getHomepageImages(),
    getWorkAlbums(),
  ]);

  /* Album media for the coverage band. Read per album because the local store
     keeps media in a separate file keyed by album id. */
  const media = await Promise.all(albums.map((album) => getWorkAlbumMedia(album.id)));

  const photos = media
    .flat()
    .filter((item) => item.kind === 'image' && item.driveFileId)
    .map((item) => ({
      src: drivePhotoUrl(item.driveFileId, 800),
      srcSet: drivePhotoSrcSet(item.driveFileId, ALBUM_GRID_WIDTHS),
      alt: item.filename,
    }));

  /* Admin-managed homepage artwork wins, because an editor chose it. Several
     rows can share a section key after the slideshow change, so the first row
     returned is the newest and only the first claim to a key is honoured. */
  const images: Record<string, string> = { ...defaultImages };
  for (const item of homepageImages) {
    if (!(item.section in images)) images[item.section] = item.imageUrl;
  }

  /* Prefer a real album cover for the hero: it is the client's own work, which
     is the whole point of the band. Fall back to bundled artwork only if no
     album has been synced yet, so a fresh clone is never a blank navy box. */
  const heroCover = albums.find((album) => album.coverDriveFileId && album.photoCount > 0);
  const heroSrc = heroCover
    ? drivePhotoUrl(heroCover.coverDriveFileId, ALBUM_COVER_WIDTH)
    : images['hero-visual-media'];
  const heroSrcSet = heroCover
    ? drivePhotoSrcSet(heroCover.coverDriveFileId, HERO_WIDTHS)
    : undefined;

  /* Three rows, alternating direction, drawn round-robin from the pool so a
     single album does not fill all three and make the band look repetitive. */
  const rows = photos.length
    ? [0, 1, 2].map((rowIndex) => ({
        photos: photos.filter((_, i) => i % 3 === rowIndex),
        reverse: rowIndex % 2 === 1,
      }))
    : [];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <PhotoHero
        imageSrc={heroSrc}
        imageSrcSet={heroSrcSet}
        imageAlt={heroCover ? `${heroCover.title} — album cover` : ''}
        priority
        eyebrow="Strategy · Technology · Media"
        title="One team for the work that decides whether growth actually happens."
        lede="The Polity brings IT consultancy, media production and project management together, so you are not coordinating three suppliers to deliver one outcome."
        actions={
          <>
            <ButtonLink href="/contact" size="lg">
              Book a free consultation
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/work" size="lg" variant="inverse">
              See our work
            </ButtonLink>
          </>
        }
        detail={
          <ul className="grid max-w-3xl gap-x-8 gap-y-3 border-t border-ink-inverse/15 pt-8 sm:grid-cols-2">
            {[
              'No discovery fee',
              'Written scope before we start',
              'Senior-led delivery',
              'Based in Walsall, working UK-wide',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-inverse/65">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        }
      />

      {/* ------------------------------------------------------------ Coverage */}
      <section className="bg-navy-800">
        <Container className="py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow invert>Recent coverage</Eyebrow>
            <h2 className="mt-6 text-headline text-ink-inverse">
              Weddings, royal engagements and studio work.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-inverse/70">
              A sample of what the team has shot. Every frame below comes straight
              from a live album.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/work" variant="inverse">
                View portfolio
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          <dl className="mx-auto mt-20 grid max-w-4xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF_POINTS.map((point) => (
              <div key={point.label} className="border-t border-ink-inverse/20 pt-6">
                <dt className="font-display text-5xl leading-none text-ink-inverse tabular">
                  {point.value}
                </dt>
                <dd className="mt-4 text-sm leading-relaxed text-ink-inverse/60">
                  {point.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* The marquee rows sit outside the container on purpose. Headings above
          stay inset while the photographs bleed to the viewport edge, so the
          media reads as larger than the layout holding it. */}
      <div className="space-y-4 pb-20 sm:space-y-5 sm:pb-24">
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <PhotoMarquee
              key={i}
              photos={row.photos}
              reverse={row.reverse}
              durationSeconds={52 + i * 14}
              /* The middle row is wider and landscape, which breaks the rhythm
                 of its neighbours so the band does not read as three identical
                 strips. */
              tileClassName={
                i === 1
                  ? 'aspect-[16/10] w-[86vw] max-w-[620px] sm:max-w-[760px]'
                  : 'aspect-[4/5] w-[74vw] max-w-[340px] sm:max-w-[420px]'
              }
              sizes={i === 1 ? '(min-width: 640px) 760px, 86vw' : '(min-width: 640px) 420px, 74vw'}
            />
          ))
        ) : (
          /* No synced albums yet. Fill the band with the bundled artwork so a
             fresh clone still shows a composed page rather than empty rows. */
          [images['hero-visual-media'], images['service-media'], images['blog-1']].map(
            (src) => (
              <div
                key={src}
                className="relative aspect-[16/9] w-full overflow-hidden bg-navy-700"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  aria-hidden="true"
                  className="object-cover"
                />
              </div>
            )
          )
        )}
      </div>

      {/* ------------------------------------------------------------ Services */}
      <Section tone="navy" className="border-b-[5px] border-brand-500">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What we do"
                title="Three practices, one point of contact."
                invert
              />
              <p className="mt-7 max-w-md leading-relaxed text-ink-inverse/70">
                Most engagements touch more than one of these. That is the point —
                the outcome is what matters, not which department it lands in.
              </p>
              <div className="mt-9">
                <ButtonLink href="/services" variant="inverse" size="sm">
                  All services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            {/* Label column beside a fluid description, hairline-divided. The
                first row carries no top rule so the block does not start with a
                stray line above the first item. */}
            <div className="lg:col-span-7">
              {SERVICES.map((service, i) => (
                <article
                  key={service.label}
                  className={`group py-8 ${
                    i === 0 ? '' : 'border-t border-ink-inverse/15'
                  } sm:py-9`}
                >
                  <div className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-10">
                    <CategoryLabel invert className="text-xl">
                      {service.label}
                    </CategoryLabel>
                    <div>
                      <p className="leading-relaxed text-ink-inverse/75 sm:max-w-[34rem] sm:pr-[12%]">
                        {service.description}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                        {service.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2 text-sm text-ink-inverse/55"
                          >
                            <Check
                              className="mt-0.5 size-3.5 shrink-0 text-brand-400"
                              aria-hidden="true"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>

                      <div className="relative mt-6 aspect-16/9 w-full max-w-sm overflow-hidden rounded-card">
                        <Image
                          src={images[service.image]}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(min-width: 640px) 384px, 100vw"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                        />
                      </div>

                      <Link
                        href={service.href}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 transition-colors duration-200 hover:text-brand-300"
                      >
                        Explore {service.label}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ Approach */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="How we work"
                title="Straight answers, senior people, no surprises."
                lede="Most of our work comes from clients who were let down somewhere else. That shapes how we operate."
                invert
              />

              <ol className="mt-12 space-y-8">
                {PRINCIPLES.map((principle, i) => (
                  <NumberedRow key={principle.title} index={i + 1} title={principle.title} invert>
                    {principle.body}
                  </NumberedRow>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-card border border-ink-inverse/15 p-8 sm:p-10">
                <CategoryLabel invert>Getting started</CategoryLabel>
                <ol className="mt-9 space-y-5">
                  {JOURNEY.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink-inverse/25 text-xs font-semibold tabular text-ink-inverse/70">
                        {i + 1}
                      </span>
                      <span className="pt-1 leading-relaxed text-ink-inverse/75">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 border-t border-ink-inverse/15 pt-8">
                  <p className="leading-relaxed text-ink-inverse/70">
                    Based in Walsall, West Midlands. Remote delivery is standard;
                    on-site visits are arranged where they genuinely help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- FAQ */}
      <Section tone="ink">
        <Container>
          <SectionHeading eyebrow="Questions" title="The things people ask first." align="center" invert />

          <div className="mx-auto mt-14 max-w-3xl border-t border-ink-inverse/15">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-ink-inverse/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink-inverse transition-colors duration-200 hover:text-brand-400">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="relative size-4 shrink-0 text-ink-inverse/50 transition-transform duration-200 group-open:rotate-45"
                  >
                    <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                  </span>
                </summary>
                <p className="pb-6 pr-10 leading-relaxed text-ink-inverse/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Journal */}
      <Section tone="ink">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Journal" title="Thinking out loud." className="max-w-xl" invert />
            <ButtonLink href="/blog" variant="inverse" size="sm">
              All articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {POSTS.map((post, i) => (
              <article key={post.title} className="group">
                <Link href="/blog" className="block">
                  <div className="relative aspect-16/10 overflow-hidden rounded-card bg-navy-700">
                    <Image
                      src={images[`blog-${i + 1}`]}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <Badge>{post.category}</Badge>
                    <time className="text-xs tabular text-ink-inverse/50">{post.date}</time>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-ink-inverse transition-colors duration-200 group-hover:text-brand-400">
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- CTA */}
      <Section tone="navy" className="border-t-[5px] border-brand-500">
        <Container>
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-inverse/60">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
            </span>
            Available for work
          </p>

          <h2 className="mt-7 max-w-[14ch] text-hero font-medium text-ink-inverse">
            Tell us what you are trying to fix.
          </h2>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" size="lg" variant="inverse">
              Book a consultation
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="tel:+447881168479"
              size="lg"
              variant="ghost"
              className="text-ink-inverse hover:text-brand-400"
            >
              07881 168479
            </ButtonLink>
          </div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-inverse/70">
            A short call is usually enough to work out whether we can help. If we
            cannot, we will say so.
          </p>
        </Container>
      </Section>

    </>
  );
}
