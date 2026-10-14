"use client";

import { Component, type ReactNode } from "react";

// If the 3D scene throws (no WebGL, the browser blocked it, the GPU reset), render the
// fallback instead of taking the whole page down with it.
export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[scene] 3D backdrop disabled:", error instanceof Error ? error.message : error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
