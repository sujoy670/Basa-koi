import { PropertyListing, ApiResponse, PaginatedResponse } from '@basa-koi/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchProperties(params?: Record<string, string>): Promise<PropertyListing[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  try {
    const res = await fetch(`${API_BASE}/properties${query}`, {
      next: { revalidate: 60 }, // ISR 60 seconds
    });
    if (!res.ok) return [];
    const json: PaginatedResponse<PropertyListing> = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch properties:', err);
    return [];
  }
}

export async function fetchPropertyById(id: string): Promise<PropertyListing | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: ApiResponse<PropertyListing> = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`Failed to fetch property ${id}:`, err);
    return null;
  }
}

