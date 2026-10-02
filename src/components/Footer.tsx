import Link from "next/link";
import { ButtonLink, Container } from "./ui";
import Logo from "./Logo";

/* Brand marks are not part of the lucide icon set, so they are inlined here.
   All three are 24x24, inherit currentColor, and are aria-hidden — the
   surrounding link carries the accessible name. */
type IconProps = { className?: string };

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38S.94 3.35.63 4.14c-.3.77-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.77.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.77.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.77-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 2.16c3.2 0 3.58.02 4.85.07 1.17.06 1.8.25 2.22.42.56.21.96.47 1.38.89.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.26.07 1.64.07 4.85s-.02 3.58-.07 4.85c-.06 1.17-.26 1.8-.42 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.59-.02-4.86-.07c-1.17-.06-1.81-.26-2.23-.42-.57-.22-.96-.48-1.38-.9-.42-.42-.69-.82-.9-1.38-.17-.42-.36-1.07-.42-2.23C.01 15.6 0 15.21 0 12s.01-3.59.07-4.86c.06-1.17.25-1.81.42-2.23.21-.57.48-.96.9-1.38.42-.42.81-.69 1.38-.9.42-.17 1.05-.36 2.22-.42C8.41 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.21-1.79 4-4 4Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

const COMPANY = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

const RESOURCES = [
  { name: "Blog", href: "/blog" },
  { name: "FAQs", href: "/faqs" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
];

const SOCIAL = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/thepolityservices",
    icon: LinkedInIcon,
  },
  {
    name: "X",
    href: "https://twitter.com/thepolityservices",
    icon: XIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/thepolityservices",
    icon: InstagramIcon,
  },
];

const CONTACT = {
  phone: "+44 7881 168479",
  phoneHref: "tel:+447881168479",
  email: "hello@thepolityservices.com",
  address: "86 Glebe Street, Walsall",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy-700 text-ink-inverse">
      <Container width="wide" className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="The Polity — home"
              className="inline-block"
            >
              <Logo variant="inverse" className="h-11" />
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-inverse/65">
              Strategy, technology and media under one roof. We help
              organisations turn ambitious plans into measurable results.
            </p>
            <ButtonLink href="/contact" size="sm" className="mt-7">
              Free consultation
            </ButtonLink>
          </div>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="tp-label text-ink-inverse/50">
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-ink-inverse/70 transition-colors duration-200 hover:text-brand-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources" className="lg:col-span-2">
            <h2 className="tp-label text-ink-inverse/50">
              Resources
            </h2>
            <ul className="mt-5 space-y-3">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-ink-inverse/70 transition-colors duration-200 hover:text-brand-500"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="tp-label text-ink-inverse/50">
              Get in touch
            </h2>
            <address className="mt-5 space-y-3 not-italic">
              <a
                href={CONTACT.phoneHref}
                className="block text-lg text-ink-inverse transition-colors duration-200 hover:text-brand-500 tabular"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="block text-[0.95rem] text-ink-inverse/70 transition-colors duration-200 hover:text-brand-500"
              >
                {CONTACT.email}
              </a>
              <p className="text-[0.95rem] text-ink-inverse/50">{CONTACT.address}</p>
            </address>

            <ul className="mt-6 flex gap-2.5">
              {SOCIAL.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`The Polity on ${name}`}
                    className="flex size-10 items-center justify-center rounded-full border border-ink-inverse/20 bg-navy-500 text-ink-inverse/70 transition-[color,border-color] duration-200 hover:border-brand-500 hover:text-brand-500"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-ink-inverse/10">
        <Container width="wide" className="py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-ink-inverse/50">
              © {year} The Polity. All rights reserved.
            </p>
            <p className="text-sm text-ink-inverse/50">
              Registered in England &amp; Wales
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
