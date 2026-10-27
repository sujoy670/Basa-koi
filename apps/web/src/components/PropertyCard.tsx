import Link from 'next/link';
import Image from 'next/image';
import { PropertyListing } from '@basa-koi/shared-types';
import { Bed, Bath, Maximize2, MapPin, CheckCircle } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyListing;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images?.find((img) => img.isCover)?.url || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={coverImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {property.propertyType.replace('_', ' ').toUpperCase()}
          </span>
          <span className="rounded-md bg-primary/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {property.suitableFor.toUpperCase()}
          </span>
        </div>

        {property.isOwnerVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-teal-600/90 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <CheckCircle className="h-3 w-3" />
            <span>Verified Owner</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl font-bold text-primary">
            ৳{property.monthlyRent.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">/ month</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate">{property.location.area}, {property.location.thana}</span>
          </div>
        </div>

        <h3 className="mt-2 line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-slate-400" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-slate-400" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4 text-slate-400" />
            <span>{property.squareFeet} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

