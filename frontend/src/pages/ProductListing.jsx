import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/common/ProductCard';
import PageHeader from '../components/ui/PageHeader';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ProductFilters from '../components/filters/ProductFilters';
import FilterDrawer from '../components/filters/FilterDrawer';
import { fetchProducts, fetchFilterMeta, setSortBy } from '../store/productSlice';
import { useDebounce } from '../hooks/useDebounce';

const ProductListing = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filteredProducts, loading, total, sortBy } = useSelector((state) => state.products);

  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || sortBy;
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');

  const filterKey = useMemo(
    () => JSON.stringify({ category, featured, brand, color, q, sort, minPrice, maxPrice, minRating }),
    [category, featured, brand, color, q, sort, minPrice, maxPrice, minRating]
  );
  const debouncedKey = useDebounce(filterKey, 320);

  useEffect(() => {
    dispatch(fetchFilterMeta());
  }, [dispatch]);

  useEffect(() => {
    const parsed = JSON.parse(debouncedKey);
    const params = { sort: parsed.sort || 'default' };
    if (parsed.category) params.category = parsed.category;
    if (parsed.featured) params.featured = 'true';
    if (parsed.brand) params.brand = parsed.brand;
    if (parsed.color) params.color = parsed.color;
    if (parsed.q) params.search = parsed.q;
    if (parsed.minPrice != null) params.minPrice = parsed.minPrice;
    if (parsed.maxPrice != null) params.maxPrice = parsed.maxPrice;
    if (parsed.minRating) params.minRating = parsed.minRating;
    dispatch(fetchProducts(params));
  }, [debouncedKey, dispatch]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (category) n += 1;
    if (featured) n += 1;
    if (brand) n += 1;
    if (color) n += 1;
    if (q) n += 1;
    if (minRating) n += 1;
    if (minPrice || maxPrice) n += 1;
    return n;
  }, [category, featured, brand, color, q, minRating, minPrice, maxPrice]);

  const handleSort = (value) => {
    dispatch(setSortBy(value));
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    setSearchParams(next);
  };

  if (loading && !filteredProducts.length) {
    return (
      <div className="page-shell">
        <PageHeader title="All Products" subtitle="Loading…" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
        <div className="container-premium py-12">
          <div className="grid lg:grid-cols-4 gap-10">
            <div className="hidden lg:block h-96 skeleton-shimmer rounded-2xl bg-line/40" />
            <div className="lg:col-span-3">
              <ProductGridSkeleton count={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error fallback
  if (!loading && !filteredProducts.length && total === 0) {
    return (
      <div className="page-shell">
        <PageHeader title="All Products" subtitle="No products found" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
        <div className="container-premium py-12">
          <div className="text-center py-24 card">
            <p className="font-display text-2xl mb-2">No products available</p>
            <p className="text-sm text-ink-muted mb-6">Please try again later or contact support.</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title={q ? `Results for "${q}"` : category || 'All Products'}
        subtitle={`${total} products available`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]}
      />

      <div className="container-premium py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-full lg:w-72 shrink-0">
            <ProductFilters />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8 pb-6 border-b border-line dark:border-white/10">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-line dark:border-white/15 bg-white dark:bg-white/5 text-sm font-semibold text-ink dark:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.036a2.5 2.5 0 01-.659 1.591l-5.432 6.198v4.864a1 1 0 01-.553.894l-4 2A1 1 0 019 20.106V13.5L3.659 7.409A2.5 2.5 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A41.026 41.026 0 0112 3z" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-ink-muted dark:text-neutral-400">
                  <span className="font-semibold text-ink dark:text-white">{total}</span> products
                  {loading && <span className="ml-2 text-brand dark:text-brand">Updating…</span>}
                </p>
              </div>
              <select value={sort} onChange={(e) => handleSort(e.target.value)} className="input w-full sm:w-auto">
                <option value="default">Featured</option>
                <option value="featured">Deals</option>
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 card">
                <p className="font-display text-2xl mb-2">No matches</p>
                <p className="text-sm text-ink-muted mb-6">Try adjusting your filters or search term.</p>
                <button type="button" onClick={() => setSearchParams({})} className="btn-secondary">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
};

export default ProductListing;
