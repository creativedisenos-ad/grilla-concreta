'use client';

export interface CurrentUser {
  name: string;
  role: 'cliente' | 'agencia' | 'director';
}

const KEY = 'conkreta_user';

export function getUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setUser(u: CurrentUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(u));
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
