"use client";

import { Component, type ReactNode } from "react";

type Props = {
  /** Shown in place of the children if rendering them throws. */
  fallback: ReactNode;
  children: ReactNode;
};

type State = { failed: boolean };

/**
 * Keeps an optional enhancement from taking the page down with it.
 *
 * The 3D scene is a progressive extra: on a machine where WebGL can't be
 * created, `@react-three/fiber` throws while configuring its renderer, which
 * would otherwise unmount the entire React tree and leave a blank page. This
 * catches that and settles for the static fallback instead.
 */
export default class RenderBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    /* A swallowed enhancement failure is indistinguishable from a working one
       in the console, which is a miserable thing to debug. Say so in dev. */
    if (process.env.NODE_ENV !== "production") {
      console.error("[RenderBoundary] falling back:", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
