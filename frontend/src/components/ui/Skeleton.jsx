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
    <div className="product-card-premium overflow-hidden h-full">
      <div className="product-card-premium__media relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f7f5] via-white to-[#eef3f0]" />
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" rounded="rounded-none" />
      </div>
      <div className="px-3.5 pt-3.5 pb-3.5 sm:px-4 sm:pt-4 sm:pb-4 space-y-3">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full rounded-full" rounded="rounded-full" />
      </div>
    </div>
  );
});

export const ProductGridSkeleton = memo(function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <div className="min-h-[58vh] md:min-h-[70vh] bg-gradient-to-br from-[#eef7f1] via-white to-[#fff4eb]">
      <div className="container-app py-16 md:py-24 space-y-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 md:h-16 w-full max-w-lg" />
        <Skeleton className="h-5 w-full max-w-md" />
        <div className="flex gap-3 pt-3">
          <Skeleton className="h-11 w-36 rounded-full" rounded="rounded-full" />
          <Skeleton className="h-11 w-28 rounded-full" rounded="rounded-full" />
        </div>
      </div>
    </div>
  );
});

export const PageHeaderSkeleton = memo(function PageHeaderSkeleton() {
  return (
    <div className="bg-mart-soft py-12 md:py-16">
      <div className="container-app space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
    </div>
  );
});

export const CheckoutSkeleton = memo(function CheckoutSkeleton() {
  return (
    <div className="container-app py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
});

export default Skeleton;
