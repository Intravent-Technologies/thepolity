'use client';

import Image from 'next/image';
import { FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
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
}

export default function Work() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Section tone="sunken" className="border-b border-line py-20 sm:py-28">
        <Container>
          <Eyebrow>Our work</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-display text-ink">Projects delivered.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Selected work across IT, media and project management. We publish
            projects we can discuss in detail, with the client&rsquo;s name on
            them.
          </p>
        </Container>
      </Section>

      <Section tone="surface" className="py-16 sm:py-20">
        <Container>
          {loading ? (
            <p className="py-20 text-center text-ink-muted">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-card border border-dashed border-line-strong bg-surface-sunken px-8 py-16 text-center">
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
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id}>
                  <div className="relative aspect-16/10 overflow-hidden rounded-card border border-line bg-surface-sunken transition-colors duration-200 hover:border-line-strong">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex aspect-16/10 w-full items-center justify-center">
                        <FolderOpen
                          className="size-8 text-ink-subtle"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Badge>{project.category}</Badge>
                    {project.client ? (
                      <span className="text-sm text-ink-subtle">{project.client}</span>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-title text-ink">{project.title}</h2>
                  <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                    {project.description}
                  </p>
                </article>
              ))}
            </div>
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
