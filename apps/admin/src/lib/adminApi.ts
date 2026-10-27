import { ApiResponse } from '@basa-koi/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchWithAdminAuth(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : process.env.ADMIN_SERVICE_TOKEN;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : { Authorization: 'Bearer mock-dev-token' }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  return res.json();
}

export async function getAdminOverview() {
  return fetchWithAdminAuth('/admin/overview');
}

export async function approveListing(id: string) {
  return fetchWithAdminAuth(`/admin/properties/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectListing(id: string, reason: string) {
  return fetchWithAdminAuth(`/admin/properties/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function toggleVerifyOwner(userId: string, isVerified: boolean) {
  return fetchWithAdminAuth(`/admin/users/${userId}/verify-owner`, {
    method: 'POST',
    body: JSON.stringify({ isVerified }),
  });
}

