'use client';

import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from '@/components/ui';

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-6 py-8 text-center">
      <p className="text-3xl font-semibold tabular text-ink sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Review[]) => {
        if (!cancelled && Array.isArray(data)) setReviews(data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Aggregate figures are computed from the reviews that actually exist.
     Nothing here is hardcoded, so the page cannot overstate. */
  const rated = reviews.filter((r) => r.rating > 0);
  const average = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(2)
    : null;
  const fiveStar = reviews.filter((r) => r.rating === 5).length;

  return (
    <>
      <Section tone="sunken" className="border-b border-line py-20 sm:py-28">
        <Container>
          <Eyebrow>Client reviews</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-display text-ink">
            In their words, not ours.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Every review below is one a client has actually given us. We do not
            publish figures we cannot show the receipts for.
          </p>
        </Container>
      </Section>

      {/* Figures are derived, not asserted. */}
      {reviews.length > 0 ? (
        <Section tone="surface" className="py-14">
          <Container>
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
              <Stat value={String(reviews.length)} label="Reviews published" />
              <Stat value={`${average}/5`} label="Average rating" />
              <Stat
                value={`${reviews.length ? Math.round((fiveStar / reviews.length) * 100) : 0}%`}
                label="Rated five stars"
              />
            </dl>
          </Container>
        </Section>
      ) : null}

      <Section tone="surface" className="py-16 sm:py-20">
        <Container>
          {loading ? (
            <p className="py-20 text-center text-ink-muted">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-card border border-dashed border-line-strong bg-surface px-8 py-16 text-center">
              <Quote className="mx-auto size-8 text-ink-subtle" aria-hidden="true" />
              <h2 className="mt-6 text-title text-ink">No reviews published yet</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                We would rather show you nothing than invent something. Once
                clients have reviewed us, their words appear here.
              </p>
              <ButtonLink href="/contact" className="mt-8">
                Work with us
              </ButtonLink>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="flex flex-col rounded-card border border-line bg-surface p-8 transition-[border-color] duration-200 hover:border-line-strong"
                >
                  <div
                    className="flex gap-0.5"
                    role="img"
                    aria-label={`Rated ${review.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`size-4 ${
                          i < review.rating
                            ? 'fill-brand-500 text-brand-500'
                            : 'text-line-strong'
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="mt-6 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">
                    {review.content}
                  </blockquote>

                  <footer className="mt-8 flex items-center gap-3.5 border-t border-line pt-6">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-ink-muted"
                    >
                      {review.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        {review.name}
                      </span>
                      {review.role ? (
                        <span className="block text-sm text-ink-subtle">
                          {review.role}
                        </span>
                      ) : null}
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section tone="sunken" className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Work with us"
              title="The next review could be yours."
              lede="Tell us what you are trying to fix and we will tell you honestly whether we can help."
              align="center"
            />
            <ButtonLink href="/contact" size="lg" className="mt-9">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
