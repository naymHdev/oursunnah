/**
 * Thin, SSR-safe wrapper around localStorage. Every call checks for
 * `window` so the same code can be imported by client components that
 * also render on the server during the initial pass without throwing.
 */

const isBrowser = () => typeof window !== "undefined";

export const readStorage = <T>(key: string): T | null => {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // Corrupted value or storage disabled (private mode etc.) — treat as empty.
    return null;
  }
};

export const writeStorage = <T>(key: string, value: T): void => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — silently ignore, cart still works in-memory.
  }
};

export const removeStorage = (key: string): void => {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
