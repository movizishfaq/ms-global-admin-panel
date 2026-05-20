export type ApiUserRole = 'buyer' | 'seller' | 'admin';

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: ApiUserRole;
}

export interface AuthSession {
  token: string;
  user: ApiUser;
}

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined)
    }
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string };
  } & T;
  if (!res.ok) {
    throw new Error(data.error?.message ?? res.statusText ?? 'Request failed');
  }
  return data;
}

export function authLogin(email: string, password: string): Promise<AuthSession> {
  return request<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function authRegister(
  email: string,
  password: string,
  name: string,
  role: 'buyer' | 'seller' = 'buyer',
  referralCode?: string
): Promise<AuthSession> {
  return request<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      name,
      role,
      ...(referralCode ? { referralCode } : {})
    })
  });
}

export interface ReferralStats {
  referralCode: string;
  commissionRatePercent: number;
  totalReferrals: number;
  commissionEarnedRp: number;
  pendingCommissionRp: number;
}

export function fetchReferralStats(token: string): Promise<ReferralStats> {
  return request<ReferralStats>('/api/referrals/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function recordReferralOrderCommission(
  orderId: string,
  customerEmail: string,
  totalRp: number
): Promise<{ recorded: boolean }> {
  return request<{ recorded: boolean }>('/api/referrals/order-commission', {
    method: 'POST',
    body: JSON.stringify({ orderId, customerEmail, totalRp })
  });
}

export function authMe(token: string): Promise<{ user: ApiUser }> {
  return request<{ user: ApiUser }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export interface OrganizationProfile {
  organizationName: string;
  legalName: string;
  registrationId: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  description: string;
}

export function fetchOrganization(
  token: string
): Promise<{ organization: OrganizationProfile }> {
  return request<{ organization: OrganizationProfile }>(
    '/api/profile/organization',
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function saveOrganization(
  token: string,
  organization: OrganizationProfile
): Promise<{ organization: OrganizationProfile }> {
  return request<{ organization: OrganizationProfile }>(
    '/api/profile/organization',
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(organization)
    }
  );
}
