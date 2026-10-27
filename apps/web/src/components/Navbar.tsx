import Link from 'next/link';
import { Home, Search, Smartphone } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Basa<span className="text-primary">-koi</span>
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              HomeFinder BD
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/properties" className="hover:text-primary transition-colors">
            Find Rent (ভাড়া)
          </Link>
          <Link href="/properties?city=Khulna" className="hover:text-primary transition-colors">
            Khulna City
          </Link>
          <Link href="#app-download" className="hover:text-primary transition-colors">
            Android App
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Search className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <a
            href="#app-download"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            <span>Get App</span>
          </a>
        </div>
      </div>
    </header>
  );
}

