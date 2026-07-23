'use client';

import { useEffect } from 'react';

import { useSceneStore } from '@/state/useSceneStore';
import type { Capability } from '@/types/scene';

/**
 * Resolve the degradation ladder once on mount and write it to the store.
 *
 *   1 full · 2 reduced · 3 static · 4 minimal   (Motion System Part 13)
 *
 * prefers-reduced-motion is the HIGHEST-priority signal — a high-end device with the OS
 * setting enabled resolves to 3, never overridden by hardware (BUILD_SPEC S3). A `?motion=`
 * query param overrides everything for QA without changing the device.
 */

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { effectiveType?: string; saveData?: boolean };
};

function probeWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

function resolveCapability(): Capability {
  const params = new URLSearchParams(window.location.search);
  const override = params.get('motion');
  if (override === '1' || override === '2' || override === '3' || override === '4') {
    return Number(override) as Capability;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 3;

  if (!probeWebGL2()) return 3;

  const nav = navigator as NavigatorWithHints;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const effectiveType = nav.connection?.effectiveType ?? '4g';
  const saveData = nav.connection?.saveData ?? false;

  if (saveData || memory <= 2 || cores <= 2) return 3;
  if (memory <= 4 || cores <= 4 || effectiveType === '3g') return 2;
  if (effectiveType === '2g' || effectiveType === 'slow-2g') return 3;

  return 1;
}

export function useCapability(): void {
  const setCapability = useSceneStore((s) => s.setCapability);

  // Synchronises the store's capability level with the device/OS signals, once.
  useEffect(() => {
    setCapability(resolveCapability());
  }, [setCapability]);
}
