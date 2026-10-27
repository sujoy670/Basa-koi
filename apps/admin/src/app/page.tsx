import { getAdminOverview } from '@/lib/adminApi';
import { Building, Users, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminOverviewPage() {
  const statsRes = await getAdminOverview().catch(() => null);
  const stats = statsRes?.data || {
    totalProperties: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    pendingReports: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Real-time metrics and moderation queue for Basa-koi (HomeFinder BD).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Approval</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900">{stats.pendingApprovals}</div>
          <Link
            href="/properties"
            className="mt-2 inline-block text-xs font-medium text-amber-700 hover:underline"
          >
            Review listings &rarr;
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Reports</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900">{stats.pendingReports}</div>
          <Link
            href="/reports"
            className="mt-2 inline-block text-xs font-medium text-rose-700 hover:underline"
          >
            View reported fraud &rarr;
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Properties</span>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900">{stats.totalProperties}</div>
          <span className="mt-2 block text-xs text-slate-400">Khulna listings</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Registered Users</span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-900">{stats.totalUsers}</div>
          <span className="mt-2 block text-xs text-slate-400">Tenants & Owners</span>
        </div>
      </div>

      {/* Moderation Fast Action Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Moderation Workflow Status</h2>
        <p className="mt-1 text-sm text-slate-500">
          Every newly listed property in Khulna goes into the approval queue. The Node.js backend automatically dispatches Firebase Cloud Messaging (FCM) push notifications to owners upon approval or rejection.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/properties"
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            Inspect Pending Listings
          </Link>
          <Link
            href="/verifications"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Owner Holding Tax Verifications
          </Link>
        </div>
      </div>
    </div>
  );
}

