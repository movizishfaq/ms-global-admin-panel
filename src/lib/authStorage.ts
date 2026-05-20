import type { ApiUser } from './api';

export const AUTH_TOKEN_KEY = 'ms-global-auth-token';

export interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: ApiUser['role'];
}

export function apiUserToStored(
  user: ApiUser & { _id?: string }
): StoredAuthUser {
  return {
    id: user.id ?? String(user._id ?? ''),
    name: user.name,
    email: user.email,
    avatar: '',
    role: user.role
  };
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
