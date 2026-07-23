import type { Metadata, Viewport } from 'next';
import { Archivo, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';

import { Navigation } from '@/components/Navigation/Navigation';
import { Providers } from '@/components/Providers/Providers';
import { Rail } from '@/components/Rail/Rail';

import '@/styles/tokens.css';
import '@/styles/reset.css';
import '@/styles/base.css';

/**
 * Fonts are self-hosted by next/font at build time — no runtime CDN request on the
 * critical path, which is a hard requirement for the brand's most important asset
 * (ARCHITECTURE Part 7). Three faces, three CSS variables, consumed only via tokens.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://partechnologys.com'),
  title: {
    default: 'PAR TECHNOLOGYS — We build systems that hold.',
    template: '%s — PAR TECHNOLOGYS',
  },
  description:
    'PAR TECHNOLOGYS engineers the operational systems that industrial, infrastructure, and service organisations depend on — built to structural standards, built to be inherited.',
  applicationName: 'PAR TECHNOLOGYS',
  authors: [{ name: 'PAR TECHNOLOGYS' }],
  openGraph: {
    type: 'website',
    title: 'PAR TECHNOLOGYS — We build systems that hold.',
    description:
      'An engineering practice that builds load-bearing software. A PAR Group Global company.',
    siteName: 'PAR TECHNOLOGYS',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#D9DCD6',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${archivo.variable} ${sourceSerif.variable} ${plexMono.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <div id="top-sentinel" aria-hidden="true" />
        <Providers>
          <Navigation />
          <Rail side="left" />
          <Rail side="right" />
          <main id="content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
