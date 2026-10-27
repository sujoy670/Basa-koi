import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPropertyById } from '@/lib/api';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Share2,
  Heart,
  Phone,
  MessageSquare,
} from 'lucide-react';

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await fetchPropertyById(params.id);
  if (!property) {
    return {
      title: 'Property Not Found | Basa-koi',
    };
  }

  const coverImage = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';

  return {
    title: `${property.title} | Basa-koi Khulna`,
    description: `${property.propertyType} in ${property.location.area}, ${property.location.thana}. Rent: ৳${property.monthlyRent}/month. ${property.description.slice(0, 140)}...`,
    openGraph: {
      title: `${property.title} — ৳${property.monthlyRent}/month`,
      description: property.description.slice(0, 160),
      images: [{ url: coverImage }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await fetchPropertyById(params.id);

  if (!property) {
    // Render a clean fallback presentation if mock ID is accessed directly
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Property Listing</h1>
        <p className="mt-2 text-sm text-slate-500">
          This property listing is syncing or unavailable. Return to{' '}
          <Link href="/properties" className="text-primary font-semibold hover:underline">
            all rentals
          </Link>
          .
        </p>
      </div>
    );
  }

  const primaryImage = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
              {property.propertyType.replace('_', ' ').toUpperCase()}
            </span>
            <span className="rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
              FOR {property.suitableFor.toUpperCase()}
            </span>
            {property.isOwnerVerified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <CheckCircle className="h-3 w-3" />
                Verified Owner
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {property.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{property.location.addressLine}, {property.location.thana}, Khulna</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:col-span-2">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          {property.images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
          {property.images.length <= 1 && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              Additional photos available in Android App
            </div>
          )}
        </div>
      </div>

      {/* Main Details & Pricing Sidebar */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Key Attributes */}
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-50 p-3 text-primary">
                <Bed className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Bedrooms</div>
                <div className="text-lg font-bold text-slate-900">{property.bedrooms}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-50 p-3 text-secondary">
                <Bath className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Bathrooms</div>
                <div className="text-lg font-bold text-slate-900">{property.bathrooms}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Maximize2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Area Size</div>
                <div className="text-lg font-bold text-slate-900">{property.squareFeet} sqft</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">About this Property</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {property.description}
            </p>
          </div>

          {/* Facilities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Amenities & Facilities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {property.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  ✓ {fac.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Contact Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="text-sm text-slate-500">Monthly Rent</div>
            <div className="mt-1 text-3xl font-extrabold text-primary">
              ৳{property.monthlyRent.toLocaleString('en-IN')}{' '}
              <span className="text-sm font-normal text-slate-500">/ month</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span className="font-semibold">৳{property.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span className="font-semibold">৳{property.serviceCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Furnishing</span>
                <span className="font-semibold capitalize">{property.furnishingStatus.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="#app-download"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat with Owner (App)</span>
              </a>

              <a
                href={`tel:${property.ownerPhone || '+8801700000000'}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call Owner</span>
              </a>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-400">
              Protected by Basa-koi Anti-Fraud listing rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

