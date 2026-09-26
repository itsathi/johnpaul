"use client";

/**
 * A `localStorage` document with an in-memory cache and subscribers.
 *
 * The cart and the academy enrolments both need to survive a reload, but
 * reading storage inside an effect means the first client render disagrees with
 * the server and every consumer re-renders twice — and saving through a second
 * effect writes the empty state back over the real one. `useSyncExternalStore`
 * is built for exactly this shape: the server snapshot is a fallback, the
 * browser snapshot is authoritative from hydration onward, and loading and
 * saving need no effect at all.
 *
 * Writes notify subscribers directly because the `storage` event only fires in
 * *other* tabs; the event listener is kept for the cross-tab case.
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";

const cache = new Map<string, string | null>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key) {
    cache.delete(event.key);
    notify(event.key);
    return;
  }
  cache.clear();
  for (const key of listeners.keys()) notify(key);
}

let attached = 0;
function attach() {
  attached += 1;
  if (attached === 1) window.addEventListener("storage", onStorage);
}
function detach() {
  attached -= 1;
  if (attached === 0) window.removeEventListener("storage", onStorage);
}

function readItem(key: string): string | null {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  let value: string | null = null;
  try {
    value = window.localStorage.getItem(key);
  } catch {
    value = null; // private mode — treat as empty
  }
  cache.set(key, value);
  return value;
}

function writeItem(key: string, value: string | null) {
  cache.set(key, value);
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* Quota exceeded — the session keeps working, it just will not persist. */
  }
  notify(key);
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback; // corrupt payload — start clean
  }
}

export function subscribe(key: string, listener: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  attach();
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(key);
    detach();
  };
}

/**
 * `T` is the persisted document. The setter receives the previous value, so
 * callers never read storage themselves and concurrent tabs cannot lose a
 * write. Pass a module-level `fallback` so the value stays referentially
 * stable.
 */
export function usePersistedState<T>(
  key: string,
  fallback: T,
): [T, (update: (previous: T) => T) => void] {
  const raw = useSyncExternalStore(
    useCallback((listener: () => void) => subscribe(key, listener), [key]),
    useCallback(() => readItem(key), [key]),
    () => null,
  );

  const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

  const setValue = useCallback(
    (update: (previous: T) => T) => {
      writeItem(key, JSON.stringify(update(parse(readItem(key), fallback))));
    },
    [key, fallback],
  );

  return [value, setValue];
}
