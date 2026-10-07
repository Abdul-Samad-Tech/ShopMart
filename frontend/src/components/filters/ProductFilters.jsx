import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PriceRangeSlider from './PriceRangeSlider';
import { setFilter } from '../../store/productSlice';

const ProductFilters = ({ onFilterChange, compact = false }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterMeta, filters } = useSelector((state) => state.products);

  const category = searchParams.get('category') || '';
  const featuredOnly = searchParams.get('featured') === 'true';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const minRating = searchParams.get('minRating') || '';
  const minPrice = Number(searchParams.get('minPrice') ?? filters.priceRange[0]);
  const maxPrice = Number(searchParams.get('maxPrice') ?? filters.priceRange[1]);

  const priceMin = filterMeta?.priceRange?.min ?? 0;
  const priceMax = filterMeta?.priceRange?.max ?? 500;

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === '' || val === false || val == null) next.delete(key);
      else next.set(key, String(val));
    });
    setSearchParams(next);
    onFilterChange?.();
  };

  const handleCategory = (cat) => updateParams({ category: cat || undefined });

  const handlePrice = ([min, max]) => {
    dispatch(setFilter({ filterType: 'priceRange', value: [min, max] }));
    updateParams({ minPrice: min, maxPrice: max });
  };

  const reset = () => {
    setSearchParams({});
    onFilterChange?.();
  };

  return (
    <div className={compact ? 'space-y-8' : 'glass-panel glass-panel-light p-6 lg:sticky lg:top-28 space-y-8 rounded-2xl'}>
      {!compact && (
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl text-luxury-charcoal dark:text-white">Refine</h2>
          <button type="button" onClick={reset} className="text-xs text-primary-700 dark:text-primary-300 hover:underline font-medium">
            Reset all
          </button>
        </div>
      )}

      <div>
        <h3 className="label-premium">Price</h3>
        <PriceRangeSlider
          min={Math.floor(priceMin)}
          max={Math.ceil(priceMax)}
          value={[minPrice, maxPrice]}
          onChange={handlePrice}
        />
      </div>

      <div>
        <h3 className="label-premium">Category</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          <label className="flex items-center gap-3 cursor-pointer text-sm">
            <input type="radio" checked={!category} onChange={() => handleCategory('')} className="radio-premium" />
            All
          </label>
          {(filterMeta?.categories || []).map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer text-sm">
              <input
                type="radio"
                checked={category === cat}
                onChange={() => handleCategory(cat)}
                className="radio-premium"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {filterMeta?.brands?.length > 0 && (
        <div>
          <h3 className="label-premium">Brand</h3>
          <select
            value={brand}
            onChange={(e) => updateParams({ brand: e.target.value || undefined })}
            className="select-premium w-full"
          >
            <option value="">All brands</option>
            {filterMeta.brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterMeta?.colors?.length > 0 && (
        <div>
          <h3 className="label-premium">Color</h3>
          <div className="flex flex-wrap gap-2">
            {filterMeta.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateParams({ color: color === c ? undefined : c })}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  color === c
                    ? 'border-luxury-charcoal bg-luxury-charcoal text-white'
                    : 'border-luxury-line hover:border-primary-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="label-premium">Minimum rating</h3>
        <select
          value={minRating}
          onChange={(e) => updateParams({ minRating: e.target.value || undefined })}
          className="select-premium w-full"
        >
          <option value="">Any rating</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
          <option value="4.5">4.5★ & up</option>
        </select>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={featuredOnly}
          onChange={() => updateParams({ featured: featuredOnly ? undefined : 'true' })}
          className="radio-premium rounded"
        />
        <span className="text-sm font-medium">Weekly deals only</span>
      </label>

      <p className="text-[10px] text-luxury-muted">
        Promo codes at checkout: SAVE10, WELCOME15
      </p>
    </div>
  );
};

export default ProductFilters;
