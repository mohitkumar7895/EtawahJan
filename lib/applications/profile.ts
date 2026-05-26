'use client';

import type { CitizenProfile } from './types';

/**
 * Single localStorage key under which the citizen profile is stored.
 * Versioned so a future schema change can be migrated without nuking
 * users' filled-in data.
 */
const STORAGE_KEY = 'jsk:applications:profile:v1';

const EMPTY_PROFILE: CitizenProfile = {};

/**
 * Read the saved profile from localStorage. Safe to call during SSR —
 * returns an empty profile when `window` is undefined or the parse
 * fails. Always returns a NEW object so the caller can safely mutate.
 */
export function loadProfile(): CitizenProfile {
  if (typeof window === 'undefined') return { ...EMPTY_PROFILE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY_PROFILE };
    return { ...EMPTY_PROFILE, ...(parsed as CitizenProfile) };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

/**
 * Persist the profile. Strips empty strings so re-loading doesn't
 * resurrect blank fields the user explicitly cleared.
 */
export function saveProfile(profile: CitizenProfile): void {
  if (typeof window === 'undefined') return;
  const cleaned: CitizenProfile = {};
  (Object.keys(profile) as (keyof CitizenProfile)[]).forEach((key) => {
    const value = profile[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      // @ts-expect-error — narrow assignment; we know the key matches.
      cleaned[key] = String(value).trim();
    }
  });
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Quota exceeded or storage disabled — non-fatal; the editor still
    // works for the current session, the user just won't get auto-fill
    // on reload.
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* swallow */
  }
}
