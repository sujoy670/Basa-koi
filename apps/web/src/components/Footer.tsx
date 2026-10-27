import Link from 'next/link';
import { Home, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Basa-koi</span>
            </div>
            <p className="text-sm text-slate-400">
              Bangladesh&apos;s smart location-based house rental and To-Let platform. Initially launching in Khulna City with verified owners and transparent pricing.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Listings & Secure Discovery</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Popular Areas (Khulna)</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/properties?thana=Sonadanga" className="hover:text-white transition-colors">
                  Sonadanga (সোনাডাঙ্গা)
                </Link>
              </li>
              <li>
                <Link href="/properties?thana=Boyra" className="hover:text-white transition-colors">
                  Boyra (বয়রা)
                </Link>
              </li>
              <li>
                <Link href="/properties?thana=Khalishpur" className="hover:text-white transition-colors">
                  Khalishpur (খালিশপুর)
                </Link>
              </li>
              <li>
                <Link href="/properties?thana=Daulatpur" className="hover:text-white transition-colors">
                  Daulatpur (দৌলতপুর)
                </Link>
              </li>
              <li>
                <Link href="/properties?thana=Shibbari" className="hover:text-white transition-colors">
                  Shibbari More (শিববাড়ি)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Property Types</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/properties?type=family_house" className="hover:text-white transition-colors">
                  Family Apartments (ফ্যামিলি বাসা)
                </Link>
              </li>
              <li>
                <Link href="/properties?type=mess" className="hover:text-white transition-colors">
                  Bachelor Mess & Rooms (মেস)
                </Link>
              </li>
              <li>
                <Link href="/properties?type=sublet" className="hover:text-white transition-colors">
                  Sublet (সাবলেট)
                </Link>
              </li>
              <li>
                <Link href="/properties?type=hostel" className="hover:text-white transition-colors">
                  Student Hostels (ছাত্র হোস্টেল)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact & Support</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Khulna, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@basa-koi.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Basa-koi (HomeFinder BD). All rights reserved. Made for Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}

