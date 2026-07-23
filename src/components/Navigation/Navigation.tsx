'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import styles from './Navigation.module.css';

/**
 * Navigation — persistent, 72px, hairline bottom rule. The nav bar is a sentence
 * (IA Part 4): WORK · STANDARD · PRACTICE · GROUP · COMMISSION, in narrative order.
 * Five slots, permanently. No dropdowns. On scroll it becomes curtain wall (glass) —
 * glass's primary permitted use. Detected via IntersectionObserver, never a scroll listener.
 */

const PRIMARY = [
  { label: 'Work', href: '/work' },
  { label: 'Standard', href: '/standard' },
  { label: 'Practice', href: '/practice' },
  { label: 'Group', href: '/group' },
] as const;

const COMMISSION = { label: 'Start a commission', href: '/commission' } as const;

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Glass-on-scroll state, read from a 1px sentinel at the top of the page.
  // IntersectionObserver only — no scroll event listener (Motion System Part 3).
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!(entry?.isIntersecting ?? true)),
      { rootMargin: '0px', threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on route change and return focus to its trigger.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header>
      <nav
        aria-label="Primary"
        className={[styles.nav, isScrolled ? styles.scrolled : null].filter(Boolean).join(' ')}
      >
        <Link href="/" className={styles.lockup} aria-label="PAR TECHNOLOGYS — home">
          PAR TECHNOLOGYS
        </Link>

        <ul className={styles.items}>
          {PRIMARY.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.item}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href={COMMISSION.href} className={styles.commission}>
          {COMMISSION.label}
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {/* Mobile: full-plane replacement, not a floating overlay. Items at D3, narrative
          order preserved, commission last as the resolution. */}
      <div
        id="mobile-menu"
        className={[styles.mobileMenu, menuOpen ? styles.mobileMenuOpen : null]
          .filter(Boolean)
          .join(' ')}
        hidden={!menuOpen}
      >
        <ul className={styles.mobileItems}>
          {PRIMARY.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.mobileItem}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={COMMISSION.href} className={styles.mobileCommission}>
              {COMMISSION.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
