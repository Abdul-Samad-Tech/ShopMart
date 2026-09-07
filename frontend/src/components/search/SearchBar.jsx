import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { apiEndpoints } from '../../services/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSearch, setImageSearch] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const debounced = useDebounce(query, 280);
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiEndpoints
      .suggestProducts(debounced)
      .then((res) => {
        if (!cancelled) setResults(res.data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goToSearch = () => {
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setImageSearch(true);
        searchByImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchByImage = async (file) => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiEndpoints.searchByImage(formData);
      setImageResults(response.data || []);
    } catch (error) {
      console.error('Image search failed:', error);
      setImageResults([]);
    } finally {
      setImageLoading(false);
    }
  };

  const clearImageSearch = () => {
    setUploadedImage(null);
    setImageSearch(false);
    setImageResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block w-full max-w-xs lg:max-w-sm">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (imageSearch) clearImageSearch();
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToSearch();
          }}
          placeholder="Search collection..."
          className="w-full pl-10 pr-12 py-2.5 rounded-full border border-luxury-line dark:border-white/15 bg-luxury-ivory/80 dark:bg-white/5 text-sm text-luxury-charcoal dark:text-white placeholder:text-luxury-muted dark:placeholder:text-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/30 outline-none"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-luxury-ivory dark:hover:bg-white/10 text-luxury-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          title="Search by image"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {open && (query.length >= 2 || results.length > 0 || imageSearch) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 right-0 mt-2 card-premium shadow-premium-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {imageSearch && (
              <div className="p-4 border-b border-luxury-line dark:border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  {uploadedImage && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-luxury-ivory dark:bg-white/10">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        onClick={clearImageSearch}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-luxury-charcoal dark:text-white">Image Search</p>
                    <p className="text-xs text-luxury-muted">Finding similar products...</p>
                  </div>
                  {imageLoading && (
                    <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                  )}
                </div>
              </div>
            )}

            {!imageSearch && loading && <p className="p-4 text-xs text-luxury-muted">Searching...</p>}
            {!imageSearch && !loading && results.length === 0 && debounced.length >= 2 && (
              <p className="p-4 text-sm text-luxury-muted">No results for &ldquo;{debounced}&rdquo;</p>
            )}
            
            {imageSearch && imageLoading && (
              <p className="p-4 text-xs text-luxury-muted text-center">Analyzing image...</p>
            )}
            
            {imageSearch && !imageLoading && imageResults.length === 0 && (
              <p className="p-4 text-sm text-luxury-muted text-center">No similar products found</p>
            )}

            {(imageSearch ? imageResults : results).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={() => {
                  setOpen(false);
                  setQuery('');
                  if (imageSearch) clearImageSearch();
                }}
                className="flex items-center gap-3 p-3 hover:bg-luxury-ivory dark:hover:bg-white/5 transition-colors"
              >
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-luxury-ivory"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-luxury-charcoal dark:text-white">{product.name}</p>
                  <p className="text-xs text-luxury-muted">
                    {product.category} · ${product.price?.toFixed(2)}
                  </p>
                </div>
                {imageSearch && product.similarity && (
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {Math.round(product.similarity * 100)}% match
                  </span>
                )}
              </Link>
            ))}
            
            {!imageSearch && debounced.length >= 2 && (
              <button
                type="button"
                onClick={goToSearch}
                className="w-full p-3 text-xs font-semibold uppercase tracking-wide text-primary-700 border-t border-luxury-line hover:bg-luxury-ivory"
              >
                View all results for &ldquo;{debounced}&rdquo;
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
