import type { Metadata, Viewport } from 'next';
import { Archivo, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';

import { CommandPalette } from '@/components/CommandPalette/CommandPalette';
import { Providers } from '@/components/Providers/Providers';

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
    default: 'PAR TECHNOLOGYS — Intelligence, software, and the systems businesses run on.',
    template: '%s — PAR TECHNOLOGYS',
  },
  description:
    'PAR TECHNOLOGYS builds AI systems, custom software, cloud infrastructure, data platforms, and the digital experiences on top of them — for companies that need systems they can depend on.',
  applicationName: 'PAR TECHNOLOGYS',
  authors: [{ name: 'PAR TECHNOLOGYS' }],
  openGraph: {
    type: 'website',
    title: 'PAR TECHNOLOGYS — Intelligence, software, and the systems businesses run on.',
    description:
      'AI, software, business transformation, digital experiences, cloud, data, and growth — engineered end to end.',
    siteName: 'PAR TECHNOLOGYS',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08090B',
  colorScheme: 'dark',
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
        <Providers>
          <main id="content">{children}</main>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
