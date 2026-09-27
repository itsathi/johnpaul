"use client";

/**
 * Audio provider — the single seam between the transport and the whole site.
 *
 * ── WHY THE ENGINE IS NOT IN STATE ──────────────────────────────────────────
 * The engine owns the media element, the audio context and the simulated
 * clock. None of that belongs in React state: a route change unmounts the page
 * but not this provider, and putting the element in state would destroy and
 * rebuild it on every navigation, which is exactly the stutter this is meant to
 * remove. So the provider subscribes to the engine and mirrors the parts the UI
 * actually renders.
 *
 * ── WHAT IS PERSISTED, AND WHAT IS NOT ──────────────────────────────────────
 * Volume and the last track are remembered so returning to the site feels
 * continuous. *Playing* is deliberately not restored. Replaying audio on its own
 * after a reload is autoplay with extra steps, and this build is meant to be
 * silent until someone asks for sound.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getEngine, type EngineSnapshot } from "@/lib/audio/engine";
import { wix } from "@/lib/media";
import {
  getVaultTrack,
  vaultRooms,
  vaultTracks,
  type VaultTrack,
} from "@/content/music-vault";

const STORAGE_KEY = "jpaudio.v1";

type Persisted = { volume: number; lastTrackId: string | null };

const PERSISTED_FALLBACK: Persisted = { volume: 0.8, lastTrackId: null };

/* ── the persisted store ─────────────────────────────────────────────────────
 * localStorage is a browser API with no server equivalent, but a returning
 * visitor's volume has to survive into the *first* client render — otherwise
 * the volume slider visibly jumps on load.
 *
 * It used to be read in an effect and pushed into state, which is the wrong
 * tool twice over: the value arrived one paint late, and `setState` in an
 * effect is a cascading render. `useSyncExternalStore` is the sanctioned
 * answer — server snapshot is the default, client snapshot is storage, and
 * React reconciles the two after hydration with no mismatch and no effect.
 *
 * The parsed value is cached because `useSyncExternalStore` compares snapshots
 * with `Object.is`: handing back a fresh object on each read would loop
 * forever. The `storage` listener is a bonus — volume now follows you across
 * tabs.
 */
let persistedCache: Persisted | null = null;
const persistedListeners = new Set<() => void>();

function sanitise(value: Partial<Persisted> | null | undefined): Persisted {
  if (!value) return PERSISTED_FALLBACK;
  return {
    volume:
      typeof value.volume === "number"
        ? Math.min(1, Math.max(0, value.volume))
        : PERSISTED_FALLBACK.volume,
    lastTrackId:
      typeof value.lastTrackId === "string" && getVaultTrack(value.lastTrackId)
        ? value.lastTrackId
        : null,
  };
}

function readPersisted(): Persisted {
  if (persistedCache) return persistedCache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    persistedCache = sanitise(raw ? (JSON.parse(raw) as Partial<Persisted>) : null);
  } catch {
    /* private mode, or corrupt JSON — the defaults are fine */
    persistedCache = PERSISTED_FALLBACK;
  }
  return persistedCache;
}

function writePersisted(next: Persisted) {
  persistedCache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota — forget it, the session still works */
  }
  persistedListeners.forEach((listener) => listener());
}

function subscribePersisted(onChange: () => void) {
  persistedListeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    persistedCache = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    persistedListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const serverPersisted = () => PERSISTED_FALLBACK;

export type AudioContextValue = {
  snapshot: EngineSnapshot;
  /** The loaded track resolved from the vault, for artwork and links. */
  track: VaultTrack | null;
  /** The queue the transport walks — the whole vault, in room order. */
  queue: VaultTrack[];
  /** Volume as a 0–1 fraction. */
  volume: number;
  muted: boolean;
  /** `true` when the transport is a stand-in, not audio. Must be surfaced. */
  simulated: boolean;
  /** Convenience: is this specific track the loaded one? */
  isActive: (id: string) => boolean;
  play: (id: string) => void;
  toggle: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (fraction: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  close: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const engine = getEngine();

  /* Mirror the engine's snapshot. `useSyncExternalStore` is what keeps the
     server render and the first client render identical — the server has no
     engine, so its snapshot is a fixed "idle" constant. */
  const snapshot = useSyncExternalStore(
    engine.subscribe,
    engine.getSnapshot,
    useCallback(() => engine.getSnapshot(), [engine]),
  );

  const persisted = useSyncExternalStore(
    subscribePersisted,
    readPersisted,
    serverPersisted,
  );

  const updatePersisted = useCallback((update: (p: Persisted) => Persisted) => {
    writePersisted(update(readPersisted()));
  }, []);

  /* Apply a remembered volume to the engine once, on first mount. */
  const appliedVolume = useRef<number | null>(null);
  useEffect(() => {
    if (appliedVolume.current !== null) return;
    appliedVolume.current = persisted.volume;
    engine.setVolume(persisted.volume);
  }, [engine, persisted.volume]);

  const track = snapshot.trackId ? getVaultTrack(snapshot.trackId) ?? null : null;

  /**
   * Pressing a row starts its track. Pressing the *active* row toggles, which
   * is what every music platform does and what a keyboard user expects from
   * Enter on the button that already has focus.
   */
  const play = useCallback(
    (id: string) => {
      if (snapshot.trackId === id) {
        engine.toggle();
        return;
      }
      updatePersisted((p) => ({ ...p, lastTrackId: id }));
      engine.load(id, { autoplay: true });
    },
    [engine, snapshot.trackId, updatePersisted],
  );

  const resume = useCallback(() => {
    void engine.play();
  }, [engine]);

  const toggle = useCallback(() => engine.toggle(), [engine]);

  /** Walks the whole vault in room order, wrapping at both ends. */
  const step = useCallback(
    (direction: 1 | -1) => {
      const current = snapshot.trackId;
      const index = current ? vaultTracks.findIndex((t) => t.id === current) : -1;
      if (index === -1) {
        const first = direction === 1 ? 0 : vaultTracks.length - 1;
        engine.load(vaultTracks[first].id, { autoplay: true });
        return;
      }
      const next =
        (index + direction + vaultTracks.length) % vaultTracks.length;
      updatePersisted((p) => ({ ...p, lastTrackId: vaultTracks[next].id }));
      engine.load(vaultTracks[next].id, { autoplay: true });
    },
    [engine, snapshot.trackId, updatePersisted],
  );

  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);

  const seek = useCallback((fraction: number) => engine.seekToFraction(fraction), [engine]);

  const setVolume = useCallback(
    (value: number) => {
      engine.setVolume(value);
      updatePersisted((p) => ({ ...p, volume: Math.min(1, Math.max(0, value)) }));
    },
    [engine, updatePersisted],
  );

  const toggleMute = useCallback(() => engine.toggleMute(), [engine]);

  const close = useCallback(() => engine.stop(), [engine]);

  const isActive = useCallback((id: string) => snapshot.trackId === id, [snapshot.trackId]);

  /* Media Session — the OS-level transport (lock screen, keyboard media keys,
     the headphone click). Only wired for real audio: publishing metadata for a
     silent demo track would be worse than not publishing it at all. */
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!track || snapshot.simulated || !track.src) return;

    const room = vaultRooms.find((r) => r.tracks.some((t) => t.id === track.id));
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: "John Paul",
      album: room?.label ?? "John Paul",
      artwork: [
        {
          src: track.artworkWix ? wix(track.artwork, 512, 512) : track.artwork,
          sizes: "512x512",
          type: track.artworkWix ? "image/avif" : "image/jpeg",
        },
      ],
    });
    navigator.mediaSession.playbackState =
      snapshot.status === "playing" ? "playing" : "paused";
    navigator.mediaSession.setActionHandler("play", () => void engine.play());
    navigator.mediaSession.setActionHandler("pause", () => engine.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => previous());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
  }, [engine, next, previous, snapshot.simulated, snapshot.status, track]);

  const value = useMemo<AudioContextValue>(
    () => ({
      snapshot,
      track,
      queue: vaultTracks,
      volume: snapshot.volume,
      muted: snapshot.muted,
      simulated: snapshot.simulated,
      isActive,
      play,
      toggle,
      resume,
      next,
      previous,
      seek,
      setVolume,
      toggleMute,
      close,
    }),
    [
      close,
      isActive,
      next,
      play,
      previous,
      resume,
      seek,
      setVolume,
      snapshot,
      toggle,
      toggleMute,
      track,
    ],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
