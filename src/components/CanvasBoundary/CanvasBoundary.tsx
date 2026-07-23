'use client';

import { Component, type ReactNode } from 'react';

/**
 * CANVAS BOUNDARY — a WebGL context failure (creation error or lost context) must never take
 * the page down. The subject is supplementary: every frame reads completely without it via
 * its DOM/SVG equivalents (BUILD_SPEC S4). On error this renders the fallback and the film
 * continues as the static-capability experience.
 */

type Props = { children: ReactNode; fallback: ReactNode };
type State = { failed: boolean };

export class CanvasBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
