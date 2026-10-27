'use client';

import { useState } from 'react';
import { approveListing, rejectListing } from '@/lib/adminApi';
import { Check, X, ShieldAlert, Building, RefreshCw } from 'lucide-react';

interface MockPendingProperty {
  id: string;
  title: string;
  ownerName: string;
  monthlyRent: number;
  thana: string;
  propertyType: string;
  createdAt: string;
}

const mockPending: MockPendingProperty[] = [
  {
    id: 'prop-kcc-001',
    title: 'Modern 3-Bed Family Apartment in Sonadanga',
    ownerName: 'Rafiqul Islam',
    monthlyRent: 18000,
    thana: 'Sonadanga',
    propertyType: 'apartment',
    createdAt: 'Today, 10:15 AM',
  },
  {
    id: 'prop-kcc-002',
    title: 'Single Room for Male Students near KUET',
    ownerName: 'Tanvir Ahmed',
    monthlyRent: 4500,
    thana: 'Boyra',
    propertyType: 'single_room',
    createdAt: 'Today, 02:30 PM',
  },
];

export default function PropertiesModerationPage() {
  const [listings, setListings] = useState<MockPendingProperty[]>(mockPending);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setProcessingId(id);
    setMessage(null);
    try {
      await approveListing(id);
      setListings((prev) => prev.filter((p) => p.id !== id));
      setMessage(`Property ${id} approved successfully. FCM push sent to owner.`);
    } catch {
      setMessage('Failed to approve property.');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    const reason = prompt('Enter rejection reason for owner:');
    if (!reason) return;

    setProcessingId(id);
    setMessage(null);
    try {
      await rejectListing(id, reason);
      setListings((prev) => prev.filter((p) => p.id !== id));
      setMessage(`Property ${id} rejected with reason. FCM push sent to owner.`);
    } catch {
      setMessage('Failed to reject property.');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Listings Moderation Queue</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and approve property submissions before they appear in public search.
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 text-sm font-semibold text-teal-800">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Type & Area</th>
              <th className="px-6 py-4">Rent (BDT)</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-400">ID: {p.id} • {p.createdAt}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize">{p.propertyType.replace('_', ' ')}</span>
                  <div className="text-xs text-slate-400">{p.thana}, Khulna</div>
                </td>
                <td className="px-6 py-4 font-bold text-teal-700">
                  ৳{p.monthlyRent.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {p.ownerName}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={processingId === p.id}
                      onClick={() => handleApprove(p.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingId === p.id}
                      onClick={() => handleReject(p.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  Queue is clear. No pending property listings awaiting moderation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

