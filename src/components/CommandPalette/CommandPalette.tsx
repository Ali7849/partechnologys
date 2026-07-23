'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { COMMISSION_EMAIL, PILLARS } from '@/features/homepage/content/pillars';
import { scrollToTarget } from '@/motion/lenis';

import styles from './CommandPalette.module.css';

/**
 * COMMAND PALETTE — the primary navigation of PAR//OS. Not a nav bar: an OS/IDE-style command
 * interface. Open with ⌘K / Ctrl+K (or the persistent chip). Type to filter, ↑/↓ to move, ↵ to
 * run, Esc to dismiss. Navigation is by command — the interface announces "engineered" before
 * the visitor reads anything.
 *
 * This is the reboot's first module. Targets currently point at the existing sections and will
 * be re-pointed as the OS environment is rebuilt around it.
 */

type Command = {
  id: string;
  label: string;
  hint: string;
  group: 'MODULE' | 'ACTION';
  run: () => void;
};

function scrollTo(id: string) {
  scrollToTarget(`#${id}`);
}

// The seven pillars are the modules; everything else is an action.
const COMMANDS: Command[] = [
  ...PILLARS.map<Command>((p) => ({
    id: p.id,
    label: p.title,
    hint: p.index,
    group: 'MODULE',
    run: () => scrollTo(p.id),
  })),
  {
    id: 'top',
    label: 'Return to the opening',
    hint: '↑',
    group: 'ACTION',
    run: () => scrollToTarget(0),
  },
  {
    id: 'commission',
    label: 'Start a commission',
    hint: '↵',
    group: 'ACTION',
    run: () => scrollTo('commission'),
  },
  {
    id: 'email',
    label: 'Copy commission email',
    hint: '@',
    group: 'ACTION',
    run: () => {
      void navigator.clipboard?.writeText(COMMISSION_EMAIL).catch(() => undefined);
    },
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.hint.includes(q));
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const runAt = useCallback(
    (index: number) => {
      const cmd = results[index];
      if (!cmd) return;
      close();
      cmd.run();
    },
    [results, close],
  );

  // Global shortcut: ⌘K / Ctrl+K toggles the palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input when it opens; clamp the active index when results shrink.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(active);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.chip}
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <span className={styles.chipKeys} aria-hidden="true">
          ⌘K
        </span>
        <span className={styles.chipLabel}>Command</span>
      </button>

      {open ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onKeyDown={onPanelKey}
        >
          <div className={styles.panel}>
            <div className={styles.prompt}>
              <span className={styles.caret} aria-hidden="true">
                PAR//
              </span>
              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Type a command or module…"
                aria-label="Command"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <ul ref={listRef} className={styles.list} role="listbox" aria-label="Commands">
              {results.length === 0 ? (
                <li className={styles.empty}>No matching command</li>
              ) : (
                results.map((c, i) => (
                  <li
                    key={c.id}
                    role="option"
                    aria-selected={i === active}
                    className={[styles.item, i === active ? styles.itemActive : '']
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      runAt(i);
                    }}
                  >
                    <span className={styles.itemGroup}>{c.group}</span>
                    <span className={styles.itemLabel}>{c.label}</span>
                    <span className={styles.itemHint} aria-hidden="true">
                      {c.hint}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <div className={styles.footer} aria-hidden="true">
              <span>↑↓ move</span>
              <span>↵ run</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
