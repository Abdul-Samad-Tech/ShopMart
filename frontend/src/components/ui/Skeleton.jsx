import { memo } from 'react';

const Skeleton = memo(function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`skeleton-shimmer bg-luxury-line/60 dark:bg-white/10 ${rounded} ${className}`}
      aria-hidden
    />
  );
});

export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="card-premium overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" rounded="rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  );
});

export const ProductGridSkeleton = memo(function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <div className="min-h-[70vh] bg-luxury-ivory dark:bg-luxury-slate animate-pulse">
      <div className="container-premium py-24 space-y-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <Skeleton className="h-6 w-full max-w-md" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
});

export const PageHeaderSkeleton = memo(function PageHeaderSkeleton() {
  return (
    <div className="bg-luxury-ivory dark:bg-luxury-slate py-16">
      <div className="container-premium space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
    </div>
  );
});

export default Skeleton;
