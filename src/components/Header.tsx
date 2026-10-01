"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { ButtonLink, Container } from "./ui";
import Logo from "./Logo";

const SERVICES = [
  { name: "IT Consultancy", href: "/services/it-consultancy" },
  { name: "Project Management", href: "/services/project-management" },
  { name: "Photography", href: "/services/media/photography" },
  { name: "Event Coverage", href: "/services/media/events" },
  { name: "Photo Tourism", href: "/services/media/photo-tourism" },
  { name: "Portraits", href: "/services/media/portraits" },
  { name: "Visuals & Graphics", href: "/services/media/visuals" },
];

const NAV = [
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Gallery", href: "/gallery" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

function Wordmark({ className = "" }: { className?: string }) {
  return <Logo className={`h-6 ${className}`} />;
}

export default function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close everything on navigation. Adjusting during render avoids the
  // cascading extra render an effect would cause.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes, and a click outside dismisses the services panel.
  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen, mobileOpen]);

  // Stop the page scrolling behind the mobile panel.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_rgba(20,18,14,0.04),0_8px_24px_-20px_rgba(20,18,14,0.4)]" : ""
      }`}
    >
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-4 z-50 rounded-full bg-ink px-4 py-2 text-sm font-medium text-ink-inverse"
      >
        Skip to content
      </a>

      <Container width="wide">
        <div className="flex h-18 items-center justify-between gap-6">
          <Link href="/" aria-label="The Polity — home" className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                isActive("/")
                  ? "text-brand-600"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                isActive("/about")
                  ? "text-brand-600"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              About
            </Link>

            <div ref={servicesRef} className="relative">
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                  isActive("/services")
                    ? "text-brand-600"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Services
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesOpen ? (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-card border border-line bg-surface p-2 shadow-[0_24px_48px_-24px_rgba(20,18,14,0.3)]">
                  {SERVICES.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ${
                        isActive(service.href)
                          ? "bg-brand-100 text-brand-800"
                          : "text-ink-muted hover:bg-cream hover:text-ink"
                      }`}
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="mt-1 block border-t border-line px-3.5 py-2.5 pt-3 text-sm font-medium text-brand-600 transition-colors duration-150 hover:text-brand-700"
                  >
                    All services →
                  </Link>
                </div>
              ) : null}
            </div>

            {NAV.filter((l) => l.href !== "/about").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-brand-600"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href="/contact"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Free consultation
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-200 hover:border-brand-500 hover:text-brand-600 lg:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-cream lg:hidden"
        >
          <Container className="py-6">
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ name: "Home", href: "/" }, { name: "About", href: "/about" }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-line py-3.5 text-lg text-ink"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <details className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-lg text-ink">
                  Services
                  <ChevronDown className="size-5 text-ink-subtle transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="pb-3">
                  {SERVICES.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block py-2.5 pl-4 text-base text-ink-muted"
                    >
                      {service.name}
                    </Link>
                  ))}
                  <Link
                    href="/services"
                    className="block py-2.5 pl-4 text-base font-medium text-brand-600"
                  >
                    All services
                  </Link>
                </div>
              </details>

              {NAV.filter((l) => l.href !== "/about").map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-line py-3.5 text-lg text-ink"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <ButtonLink href="/contact" className="mt-6 w-full">
              Free consultation
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
