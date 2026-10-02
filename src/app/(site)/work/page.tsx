'use client';

import Image from 'next/image';
import { FolderOpen, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
} from '@/components/ui';

interface WorkProject {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
  videoUrl: string;
}

const ALL = 'All';

export default function Work() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/work')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: WorkProject[]) => {
        if (!cancelled && Array.isArray(data)) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Built from the loaded records rather than a hardcoded list, so a category
   * added in the admin shows up here without a code change. Categories are free
   * text and normalised case-insensitively, so "IT" and "it" merge into one.
   */
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const project of projects) {
      const label = project.category.trim();
      if (!label) continue;
      const key = label.toLowerCase();
      if (!seen.has(key)) seen.set(key, label);
    }
    return [ALL, ...seen.values()];
  }, [projects]);

  const visible = useMemo(() => {
    if (filter === ALL) return projects;
    return projects.filter((project) => project.category.trim().toLowerCase() === filter.toLowerCase());
  }, [projects, filter]);

  return (
    <>
      <Section tone="sunken" className="border-b border-line py-20 sm:py-28">
        <Container>
          <Eyebrow>Our work</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-display text-ink">Projects delivered.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Selected work across IT, media and project management: client
            projects we can discuss in detail, alongside a visual record of what
            we produced.
          </p>
        </Container>
      </Section>

      <Section tone="surface" className="py-16 sm:py-20">
        <Container>
          {loading ? (
            <p className="py-20 text-center text-ink-muted">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-card border border-dashed border-line-strong bg-surface px-8 py-16 text-center">
              <FolderOpen className="mx-auto size-8 text-ink-subtle" aria-hidden="true" />
              <h2 className="mt-6 text-title text-ink">No case studies published yet</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                We are documenting current work now. If you would like to see
                relevant experience, ask us directly and we will walk you
                through it.
              </p>
              <ButtonLink href="/contact" className="mt-8">
                Ask about our work
              </ButtonLink>
            </div>
          ) : (
            <>
              {categories.length > 2 ? (
                <div
                  className="mb-12 flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter work by category"
                >
                  {categories.map((category) => {
                    const active = filter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setFilter(category)}
                        aria-pressed={active}
                        className={
                          active
                            ? 'rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-colors'
                            : 'rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink'
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {visible.length === 0 ? (
                <p className="py-16 text-center text-ink-muted">
                  Nothing in {filter} yet.
                </p>
              ) : (
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                  {visible.map((project) => (
                    <article key={project.id}>
                      <div className="relative aspect-16/10 overflow-hidden rounded-card border border-line bg-surface transition-colors duration-200 hover:border-line-strong">
                        {/*
                          A video renders on top of its cover image when one is
                          set. preload="metadata" fetches just enough to show a
                          poster frame without pulling the whole file, and
                          controls are required: no autoplay.
                        */}
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        ) : null}
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            controls
                            preload="metadata"
                            playsInline
                            aria-label={project.title}
                            className="absolute inset-0 size-full object-cover"
                          />
                        ) : null}
                        {!project.image && !project.videoUrl ? (
                          <div className="flex size-full items-center justify-center">
                            <FolderOpen
                              className="size-8 text-ink-subtle"
                              aria-hidden="true"
                            />
                          </div>
                        ) : null}
                        {project.videoUrl && !project.image ? (
                          <PlayCircle
                            className="pointer-events-none absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-cream/80"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {project.category ? <Badge>{project.category}</Badge> : null}
                        {project.client ? (
                          <span className="text-sm text-ink-subtle">{project.client}</span>
                        ) : null}
                      </div>

                      <h2 className="mt-3 text-title text-ink">{project.title}</h2>
                      {project.description ? (
                        <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                          {project.description}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </Section>

      <Section tone="sunken" className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-headline text-ink">Start a project</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Tell us what you are trying to fix. We will tell you honestly
              whether we are the right people for it.
            </p>
            <ButtonLink href="/contact" size="lg" className="mt-9">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
