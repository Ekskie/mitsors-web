'use client';


import { CheckCircle, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useUserProfile } from '@/hooks/use-user-profile';
import { usePricesAggregated } from '@/hooks/use-prices-aggregated';


function PriceCardSkeleton({ variant }: { variant: 'verified' | 'unverified' }) {
  const isVerified = variant === 'verified';
  
  return (
    <Card
      className={`${
        isVerified
          ? 'border-primary/30 bg-primary/5'
          : 'border-muted-foreground/20 bg-muted/50'
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Users className="h-5 w-5 text-muted-foreground" />
          )}
          <CardTitle
            className={`text-lg ${
              isVerified
                ? 'text-foreground'
                : 'text-foreground'
            }`}
          >
            {isVerified ? 'Verified Trader Average' : 'Unverified User Average'}
          </CardTitle>
        </div>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-12 w-40" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

function PriceCard({
  variant,
  priceData,
  region,
  city,
}: {
  variant: 'verified' | 'unverified';
  priceData: { pricePerKg: number; sampleSize: number; lastUpdated: string } | null;
  region: string;
  city: string;
}) {
  const isVerified = variant === 'verified';

  return (
    <Card
      className={`${
        isVerified
          ? 'border-primary/30 bg-primary/5'
          : 'border-muted-foreground/20 bg-muted/50'
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Users className="h-5 w-5 text-muted-foreground" />
          )}
          <CardTitle className="text-lg text-foreground">
            {isVerified ? 'Verified Trader Average' : 'Unverified User Average'}
          </CardTitle>
        </div>
        <CardDescription>
          {region} • {city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!priceData ? (
          <div className="text-sm font-semibold text-muted-foreground">
            No data available
          </div>
        ) : (
          <>
            <div className="mb-2 text-4xl font-bold text-foreground">
              ₱{priceData.pricePerKg.toFixed(2)}
              <span className="ml-2 text-xl font-normal">/ kg</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Based on {priceData.sampleSize} price{priceData.sampleSize !== 1 ? 's' : ''}
            </div>
            <div className="mt-1 text-xs text-muted-foreground/80">
              Updated {new Date(priceData.lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();

  const { data, isLoading: isLoadingPrices } = usePricesAggregated(
    profile?.region,
    profile?.city
  );

  const isLoading =
    isLoadingProfile || isLoadingPrices || !profile?.region || !profile?.city;

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <PriceCardSkeleton variant="verified" />
        <PriceCardSkeleton variant="unverified" />
      </div>
    );
  }

  if (!profile || !data || !profile?.region || !profile?.city) {
    return (
      <div className="flex min-h-[200px] flex-col gap-4 rounded-lg border border-dashed p-6">
        <div className="text-sm text-muted-foreground">
          Unable to load price data
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      <PriceCard
        variant="verified"
        priceData={data.verifiedAverage}
        region={data.region}
        city={data.city}
      />
      <PriceCard
        variant="unverified"
        priceData={data.unverifiedAverage}
        region={data.region}
        city={data.city}
      />
    </div>
  );
}
