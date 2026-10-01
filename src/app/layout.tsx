import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://thepolityservices.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Polity — Strategy, Technology & Media",
    template: "%s | The Polity",
  },
  description:
    "The Polity is a Walsall-based consultancy delivering IT consultancy, project management and media production. Strategy, technology and media under one roof.",
  applicationName: "The Polity",
  keywords: [
    "IT consultancy Walsall",
    "project management West Midlands",
    "media production Walsall",
    "photography",
    "event coverage",
    "business strategy",
  ],
  authors: [{ name: "The Polity", url: SITE_URL }],
  creator: "The Polity",
  publisher: "The Polity",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "The Polity",
    title: "The Polity — Strategy, Technology & Media",
    description:
      "IT consultancy, project management and media production for organisations that need measurable results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Polity — Strategy, Technology & Media",
    description:
      "IT consultancy, project management and media production for organisations that need measurable results.",
  },
  robots: { index: true, follow: true },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff8023",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${newsreader.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
