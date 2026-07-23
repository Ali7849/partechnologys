import Link from 'next/link';

import { Button } from '@/primitives/Button/Button';
import { Text } from '@/primitives/Text/Text';

import styles from './TitleBlock.module.css';

/**
 * TitleBlock — the footer as an engineering drawing's title block. Four columns matching
 * primary navigation exactly (footer hierarchy that contradicts nav is the most common
 * unnoticed architectural failure). The bottom bar carries a REAL revision + issue date,
 * stamped from git at build time (ARCHITECTURE Part 5) — the cheapest credibility on the
 * site. Server component: it reads build-time env, holds no state.
 */

const COLUMNS = [
  {
    heading: 'Work',
    href: '/work',
    links: [
      { label: 'All projects', href: '/work' },
      { label: 'By sector', href: '/work?view=sector' },
      { label: 'By system', href: '/work?view=system' },
    ],
  },
  {
    heading: 'Standard',
    href: '/standard',
    links: [
      { label: 'The standard', href: '/standard' },
      { label: 'Download PDF', href: '/standard#download' },
      { label: 'The record', href: '/record' },
    ],
  },
  {
    heading: 'Practice',
    href: '/practice',
    links: [
      { label: 'How we engage', href: '/practice' },
      { label: 'Engagement floor', href: '/practice#floor' },
      { label: 'What we refuse', href: '/practice#refuse' },
      { label: 'Careers', href: '/practice/careers' },
    ],
  },
  {
    heading: 'Group',
    href: '/group',
    links: [
      { label: 'PAR Group Global', href: '/group#par-group' },
      { label: 'Pontis Construction', href: '/group#pontis' },
      { label: 'Joint capability', href: '/group#joint' },
    ],
  },
] as const;

export function TitleBlock() {
  const rev = process.env.NEXT_PUBLIC_BUILD_REV ?? 'dev';
  const date = process.env.NEXT_PUBLIC_BUILD_DATE ?? '0000-00-00';

  return (
    <footer className={styles.footer}>
      <div className={styles.masthead}>
        <div>
          <Text as="span" scale="h3" className={styles.name}>
            PAR TECHNOLOGYS
          </Text>
          <Text as="p" scale="b2" tone="zinc">
            We build systems that hold.
          </Text>
        </div>
        <Button tier="secondary" href="/commission">
          Start a commission
        </Button>
      </div>

      <nav aria-label="Footer" className={styles.columns}>
        {COLUMNS.map((col) => (
          <div key={col.heading} className={styles.column}>
            <Link href={col.href} className={styles.columnHeading}>
              {col.heading}
            </Link>
            <ul className={styles.columnLinks}>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.bar}>
        <span>REV {rev}</span>
        <span aria-hidden="true">·</span>
        <span>
          ISSUED <time dateTime={date}>{date}</time>
        </span>
        <span aria-hidden="true">·</span>
        <span>SHEET 01 OF 09</span>
        <span aria-hidden="true">·</span>
        <Link href="/legal/privacy" className={styles.barLink}>
          Privacy
        </Link>
        <Link href="/legal/terms" className={styles.barLink}>
          Terms
        </Link>
        <span className={styles.endorsement}>a PAR Group Global company</span>
      </div>
    </footer>
  );
}
