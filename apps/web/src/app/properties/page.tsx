import { fetchProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';

interface PropertiesPageProps {
  searchParams: {
    thana?: string;
    type?: string;
    suitableFor?: string;
    minRent?: string;
    maxRent?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const properties = await fetchProperties(searchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Available Rentals in Khulna
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing verified house, flat, and mess listings in Khulna City Corporation.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" action="/properties" className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Area / Thana</label>
            <input
              type="text"
              name="thana"
              defaultValue={searchParams.thana || ''}
              placeholder="e.g. Sonadanga"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Property Type</label>
            <select
              name="type"
              defaultValue={searchParams.type || ''}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="family_house">Family House</option>
              <option value="single_room">Single Room</option>
              <option value="sublet">Sublet</option>
              <option value="mess">Bachelor Mess</option>
              <option value="hostel">Hostel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Suitable For</label>
            <select
              name="suitableFor"
              defaultValue={searchParams.suitableFor || ''}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="">Any</option>
              <option value="family">Family (ফ্যামিলি)</option>
              <option value="bachelor">Bachelor (ব্যাচেলর)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Max Rent (BDT ৳)</label>
            <input
              type="number"
              name="maxRent"
              defaultValue={searchParams.maxRent || ''}
              placeholder="e.g. 20000"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </form>

      {/* Results Grid */}
      <div className="mt-8">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900">No properties matched your filters</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your rent range or searching a neighboring thana in Khulna.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

