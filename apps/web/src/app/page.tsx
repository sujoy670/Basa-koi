import Link from 'next/link';
import { Search, MapPin, Building, ShieldCheck, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/lib/api';

export default async function HomePage() {
  const properties = await fetchProperties({ limit: '6' });

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white py-16 sm:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Initial Launch: Khulna City Corporation (KCC)
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Smart House Rental & To-Let in <span className="text-primary">Bangladesh</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 sm:text-xl">
              Discover verified apartments, bachelor mess, rooms, and family houses in Khulna. No fake broker fees. Accurate locations.
            </p>

            {/* Quick Search Box */}
            <form action="/properties" method="GET" className="mt-8 flex flex-col gap-3 sm:flex-row p-2 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex flex-1 items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <input
                  type="text"
                  name="thana"
                  placeholder="Area / Thana (e.g. Sonadanga, Boyra, Khalishpur)"
                  className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <Building className="h-5 w-5 text-secondary shrink-0" />
                <select
                  name="type"
                  aria-label="Property Type"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">All Property Types</option>
                  <option value="apartment">Apartment / Flat</option>
                  <option value="family_house">Family House</option>
                  <option value="single_room">Single Room</option>
                  <option value="sublet">Sublet</option>
                  <option value="mess">Bachelor Mess</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-teal-50 p-3 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verified Owners</h3>
              <p className="mt-1 text-sm text-slate-500">
                Holding numbers and identity verification ensure listings are authentic.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-sky-50 p-3 text-secondary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Location Map Discovery</h3>
              <p className="mt-1 text-sm text-slate-500">
                Explore listings via OpenStreetMap with neighborhood and distance radius filters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Owner Contact</h3>
              <p className="mt-1 text-sm text-slate-500">
                Chat or call verified owners directly. No fake broker fees or third-party interference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Recently Listed
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Fresh Rentals in Khulna
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
            <Building className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900">Connecting to Live Marketplace</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              Our verified listings are actively syncing with the Node.js API backend. Browse categories or download the mobile app.
            </p>
            <Link
              href="/properties"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Browse All Properties
            </Link>
          </div>
        )}
      </section>

      {/* 4. Android App Download CTA */}
      <section id="app-download" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-12 sm:py-16 text-white shadow-2xl">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300">
              Native Android Experience
            </span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Find houses on the go with the Basa-koi Mobile App
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Get real-time push notifications when new houses in your target neighborhood are listed. Real-time chat with landlords and interactive MapLibre map search.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 transition-colors"
              >
                <Smartphone className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 uppercase">Available on</div>
                  <div>Google Play Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

