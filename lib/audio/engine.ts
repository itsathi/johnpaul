"use client";

/**
 * Audio engine.
 *
 * ── WHY THIS IS A CLASS AND NOT A HOOK ──────────────────────────────────────
 * The player has to survive route changes, and React unmounts providers' state
 * with the tree. So the transport lives here, in one instance held for the
 * life of the document, and the provider subscribes to it. Navigating from
 * `/music` to `/shop` swaps the page but never touches the element.
 *
 * ── THE TWO TRANSPORTS ─────────────────────────────────────────────────────
 * `load()` takes a track. What happens next depends entirely on whether the
 * track carries a `src`:
 *
 *   src set   → a real `HTMLAudioElement`. Real play, real pause, real seek,
 *               real `duration`, real `timeupdate`, real volume. This is the
 *               production path and it is fully wired; nothing simulates
 *               anything.
 *
 *   src null  → no file has been supplied for this work, so the transport runs
 *               on a `requestAnimationFrame` clock. Elapsed time advances, the
 *               player reaches the end and moves to the next track — the
 *               *behaviour* is real. Only the sound is absent, and the UI says
 *               so wherever the transport is visible.
 *
 * ── AUTOPLAY ────────────────────────────────────────────────────────────────
 * Nothing here calls `play()` outside a user gesture. `load()` and `play()`
 * only ever run from a click handler, and `load()` with `autoplay: false`
 * simply prepares. A real audio file therefore obeys browser autoplay policy
 * for free, and this build starts silent on every route including a reload.
 *
 * ── THE ANALYSER ───────────────────────────────────────────────────────────
 * A `MediaElementAudioSourceNode` is only built when it can actually be useful,
 * and it is never in the critical path:
 *
 *   - `crossOrigin` is NOT set. Setting it on a host that does not send CORS
 *     headers fails the *whole media load*, which is far worse than a silent
 *     visualiser. The trade is that cross-origin media yields a zeroed
 *     frequency array, so the visualiser has its own detection: it checks
 *     whether the data is all zero while audio is playing and drops to the
 *     static profile instead of drawing a flat line.
 *   - `createMediaElementSource` may only be called once per element, so it is
 *     memoised, and its whole call is wrapped — if it throws, playback continues
 *     through the element's normal output path.
 *   - Nothing is routed *through* the graph to be heard. The element stays
 *     connected to the destination as well, so audio is never at the mercy of
 *     a failed graph.
 *
 * Spectrum data is read straight off the analyser by the visualiser on its own
 * frame, deliberately not through React state — pushing 60fps of `Uint8Array`
 * into a context value would re-render the entire site sixty times a second.
 */

import { getVaultTrack, type VaultTrack } from "@/content/music-vault";

export type EngineStatus = "idle" | "loading" | "playing" | "paused" | "error";

export type EngineSnapshot = {
  trackId: string | null;
  status: EngineStatus;
  /** Seconds. Always 0 when nothing is loaded. */
  currentTime: number;
  /** Seconds. From the media element, or the track's demo timeline. */
  duration: number;
  volume: number;
  muted: boolean;
  /**
   * True when the transport clock is a stand-in because the track has no audio
   * file. The UI must not present this as audio.
   */
  simulated: boolean;
  error: string | null;
};

export type PlaybackListener = (snapshot: EngineSnapshot) => void;
export type TrackEndListener = (trackId: string) => void;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const IDLE: EngineSnapshot = {
  trackId: null,
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  simulated: false,
  error: null,
};

class AudioEngine {
  /** The real media element. Created on first use, never in module scope —
   *  touching `Audio` during SSR would break the server render. */
  private element: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private graphTried = false;

  private snapshot: EngineSnapshot = IDLE;

  /** The loaded track, resolved from the vault by id so the engine never has
   *  to be handed a track object that could drift from the content layer. */
  private track: VaultTrack | null = null;

  private listeners = new Set<PlaybackListener>();
  private endListeners = new Set<TrackEndListener>();

  /** rAF handle for the simulated transport, and the frame it started on. */
  private clockFrame = 0;
  private clockAt = 0;

  getSnapshot = (): EngineSnapshot => this.snapshot;

  subscribe = (listener: PlaybackListener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** Fires when a track reaches its end, so the provider can advance. */
  onTrackEnd = (listener: TrackEndListener): (() => void) => {
    this.endListeners.add(listener);
    return () => {
      this.endListeners.delete(listener);
    };
  };

  private emit(patch: Partial<EngineSnapshot> = {}) {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) listener(this.snapshot);
  }

  /* ---------------------------------------------------------------- */
  /* Element                                                           */
  /* ---------------------------------------------------------------- */

  private getElement(): HTMLAudioElement {
    if (this.element) return this.element;
    const el = new Audio();
    // Nothing is ever set to autoplay. `preload` is metadata only — the
    // browser will not buffer a track the visitor has not asked for.
    el.preload = "metadata";
    el.autoplay = false;
    el.volume = this.snapshot.volume;
    el.muted = this.snapshot.muted;
    el.addEventListener("timeupdate", this.onTimeUpdate);
    el.addEventListener("durationchange", this.onTimeUpdate);
    el.addEventListener("loadedmetadata", this.onTimeUpdate);
    el.addEventListener("play", this.onPlayEvent);
    el.addEventListener("pause", this.onPauseEvent);
    el.addEventListener("waiting", this.onWaitingEvent);
    el.addEventListener("canplay", this.onCanPlayEvent);
    el.addEventListener("error", this.onErrorEvent);
    el.addEventListener("ended", this.onEnded);
    this.element = el;
    return el;
  }

  private onTimeUpdate = () => {
    if (!this.element || this.snapshot.simulated) return;
    this.emit({
      currentTime: this.element.currentTime,
      duration: Number.isFinite(this.element.duration) ? this.element.duration : 0,
    });
  };

  private onPlayEvent = () => this.emit({ status: "playing", error: null });
  private onPauseEvent = () => {
    // `pause` also fires at the end of a real file; don't fight `ended`.
    if (this.snapshot.status !== "error") this.emit({ status: "paused" });
  };
  private onWaitingEvent = () => this.emit({ status: "loading" });
  private onCanPlayEvent = () => {
    if (this.snapshot.status === "loading") this.emit({ status: "paused" });
  };
  private onErrorEvent = () => {
    this.stopClock();
    this.emit({
      status: "error",
      error: "This track could not be loaded. The streaming links below are the way in.",
    });
  };
  private onEnded = () => {
    const id = this.snapshot.trackId;
    if (!id) return;
    this.emit({ currentTime: this.snapshot.duration, status: "paused" });
    for (const listener of this.endListeners) listener(id);
  };

  /* ---------------------------------------------------------------- */
  /* Analyser                                                          */
  /* ---------------------------------------------------------------- */

  /**
   * Builds the visualiser graph, once, and never lets it break playback.
   *
   * The element is intentionally left connected to the destination as well —
   * audio is heard through the element's own path, and the analyser is a
   * parallel tap. A cross-origin source that refuses to feed the graph then
   * costs the visualiser nothing and costs playback nothing.
   */
  private ensureAnalyser(): AnalyserNode | null {
    if (this.analyser) return this.analyser;
    if (this.graphTried) return null;
    this.graphTried = true;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.audioContext = new Ctor();
      this.sourceNode = this.audioContext.createMediaElementSource(this.getElement());
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.78;
      this.sourceNode.connect(this.analyser);
      // Deliberately NOT connecting analyser → destination. See the header.
      return this.analyser;
    } catch {
      // No graph. The element still plays; the visualiser falls back.
      this.analyser = null;
      this.sourceNode = null;
      return null;
    }
  }

  /** Read by the visualiser on its own frame. Never routed through state. */
  getAnalyser = (): AnalyserNode | null => this.analyser;

  /** Browsers suspend an AudioContext until a gesture; called on first play. */
  async resumeContext() {
    const ctx = this.audioContext;
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* The gesture was not enough this time. Playback is unaffected. */
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Simulated clock                                                   */
  /* ---------------------------------------------------------------- */

  private stopClock() {
    if (this.clockFrame) cancelAnimationFrame(this.clockFrame);
    this.clockFrame = 0;
  }

  private startClock() {
    this.stopClock();
    this.clockAt = performance.now();
    const step = () => {
      if (this.snapshot.status !== "playing" || !this.snapshot.simulated) return;
      const now = performance.now();
      // Wall-clock delta, not a frame count, so a throttled tab or a dropped
      // frame cannot make the transport drift.
      const next = this.snapshot.currentTime + (now - this.clockAt) / 1000;
      this.clockAt = now;

      if (next >= this.snapshot.duration) {
        this.emit({ currentTime: this.snapshot.duration, status: "paused" });
        const id = this.snapshot.trackId;
        if (id) for (const listener of this.endListeners) listener(id);
        return;
      }
      this.emit({ currentTime: next });
      this.clockFrame = requestAnimationFrame(step);
    };
    this.clockFrame = requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------- */
  /* Transport                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Points the transport at a track. Never starts it — call `play()` for that.
   * Returns `true` if this track carries a real audio file.
   */
  load(trackId: string, { autoplay = false }: { autoplay?: boolean } = {}): boolean {
    const track = getVaultTrack(trackId);
    if (!track) return false;

    const sameTrack = this.track?.id === track.id;
    // Re-pressing the active track should not restart it from zero.
    const resume = sameTrack ? this.snapshot.status === "playing" : false;
    this.track = track;
    this.stopClock();

    if (track.src) {
      const el = this.getElement();
      if (el.src !== track.src) {
        el.src = track.src;
        el.load();
      }
      this.emit({
        trackId: track.id,
        status: "loading",
        currentTime: 0,
        duration: 0,
        simulated: false,
        error: null,
      });
      this.ensureAnalyser();
      if (autoplay || resume) void this.play();
      return true;
    }

    /* No file. Park the element — an abandoned real file must not keep
       playing under a track row that has changed. */
    if (this.element) this.element.pause();
    this.emit({
      trackId: track.id,
      status: "paused",
      currentTime: 0,
      duration: track.demoSeconds,
      simulated: true,
      error: null,
    });
    if (autoplay || resume) void this.play();
    return false;
  }

  async play(): Promise<void> {
    const track = this.track;
    if (!track) return;

    if (track.src) {
      const el = this.getElement();
      this.ensureAnalyser();
      this.emit({ status: "playing", error: null });
      try {
        await el.play();
        await this.resumeContext();
      } catch {
        // Autoplay policy or a dead URL. The element will have raised `error`
        // for the latter; this covers the former and the "no supported source".
        this.emit({
          status: "error",
          error: "This track could not be played here. Use the streaming links to hear the real recording.",
        });
      }
      return;
    }

    // Restarting from the end on replay, the way a real player does.
    if (this.snapshot.currentTime >= this.snapshot.duration) {
      this.emit({ currentTime: 0 });
    }
    this.emit({ status: "playing", error: null });
    this.startClock();
  }

  pause() {
    if (this.snapshot.simulated) {
      this.stopClock();
    } else if (this.element) {
      this.element.pause();
    }
    this.emit({ status: "paused" });
  }

  toggle() {
    if (this.snapshot.status === "playing") this.pause();
    else void this.play();
  }

  /** Seeks by fraction, so it works identically for real and simulated tracks. */
  seekToFraction(fraction: number) {
    const total = this.snapshot.duration;
    if (!total || !this.track) return;
    const next = total * clamp01(fraction);
    if (this.snapshot.simulated) {
      this.clockAt = performance.now();
      this.emit({ currentTime: next });
      if (this.snapshot.status === "playing") this.startClock();
    } else if (this.element) {
      try {
        this.element.currentTime = next;
      } catch {
        /* Seeking before metadata is ready is not an error worth surfacing. */
      }
    }
  }

  setVolume(next: number) {
    const value = clamp01(next);
    if (this.element) this.element.volume = value;
    this.emit({ volume: value, muted: value === 0 ? this.snapshot.muted : false });
  }

  toggleMute() {
    const muted = !this.snapshot.muted;
    if (this.element) this.element.muted = muted;
    this.emit({ muted });
  }

  /** Fully silences the transport and forgets the track. */
  stop() {
    this.stopClock();
    if (this.element) {
      this.element.pause();
      this.element.removeAttribute("src");
      this.element.load();
    }
    this.track = null;
    this.emit({ ...IDLE, volume: this.snapshot.volume, muted: this.snapshot.muted });
  }
}

/**
 * One instance for the document. Created lazily so the server never sees it.
 * A module-level `let` rather than a `useRef` in the provider is what makes
 * the transport outlive the provider's subtree during a route change.
 */
let engine: AudioEngine | null = null;

export function getEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine();
  return engine;
}
