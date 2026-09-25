import { useSyncExternalStore } from "react";

let done = false;
const listeners = new Set<() => void>();

export function markPreloadDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

/** True once the preloader has finished — gates entrance choreography. */
export function usePreloaderDone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => false,
  );
}