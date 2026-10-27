import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building,
  ShieldCheck,
  Users,
  FileText,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Basa-koi Admin & Moderation Portal',
  description: 'Administrative and moderation dashboard for HomeFinder BD',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-100 antialiased">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
              B
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">Basa-koi</span>
              <span className="block text-[10px] font-semibold uppercase text-teal-400">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-teal-400" />
              <span>Overview</span>
            </Link>

            <Link
              href="/properties"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Building className="h-4 w-4 text-teal-400" />
              <span>Listings Moderation</span>
            </Link>

            <Link
              href="/verifications"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span>Owner Verifications</span>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Reports & Fraud</span>
            </Link>

            <Link
              href="/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Users className="h-4 w-4 text-teal-400" />
              <span>Users</span>
            </Link>

            <Link
              href="/audit-logs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FileText className="h-4 w-4 text-teal-400" />
              <span>Audit Logs</span>
            </Link>
          </nav>

          <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Environment:</span>
              <span className="rounded bg-teal-950 px-1.5 py-0.5 text-teal-300 font-mono">
                Production
              </span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div className="text-sm font-semibold text-slate-700">
              Khulna Regional Command
            </div>
            <div className="flex items-center gap-4">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-700"
              >
                <span>Live Marketplace</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                AD
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

