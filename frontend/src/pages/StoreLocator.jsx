import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const StoreLocator = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('store-locator');
        setPageContent(res.data);
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const stores = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    // Karachi
    { id: 1, name: 'ShopMart Main Branch', city: 'Karachi', area: 'Clifton', address: 'Block 4, Clifton, Karachi', phone: '021-1234567', timings: '9:00 AM - 10:00 PM', coordinates: { lat: 24.8136, lng: 67.0311 } },
    { id: 2, name: 'ShopMart Saddar', city: 'Karachi', area: 'Saddar', address: 'M.A. Jinnah Road, Saddar, Karachi', phone: '021-2345678', timings: '10:00 AM - 9:00 PM', coordinates: { lat: 24.8573, lng: 67.0088 } },
    { id: 3, name: 'ShopMart Gulshan', city: 'Karachi', area: 'Gulshan-e-Iqbal', address: 'Block 10, Gulshan-e-Iqbal, Karachi', phone: '021-3456789', timings: '9:00 AM - 11:00 PM', coordinates: { lat: 24.9356, lng: 67.0821 } },
    { id: 4, name: 'ShopMart North Nazimabad', city: 'Karachi', area: 'North Nazimabad', address: 'Block H, North Nazimabad, Karachi', phone: '021-4567890', timings: '10:00 AM - 9:30 PM', coordinates: { lat: 24.9687, lng: 67.0471 } },
    
    // Lahore
    { id: 5, name: 'ShopMart DHA', city: 'Lahore', area: 'DHA Phase 3', address: 'Commercial Area, DHA Phase 3, Lahore', phone: '042-1234567', timings: '9:00 AM - 10:00 PM', coordinates: { lat: 31.5074, lng: 74.3572 } },
    { id: 6, name: 'ShopMart Gulberg', city: 'Lahore', area: 'Gulberg III', address: 'MM Alam Road, Gulberg III, Lahore', phone: '042-2345678', timings: '10:00 AM - 11:00 PM', coordinates: { lat: 31.5268, lng: 74.3625 } },
    { id: 7, name: 'ShopMart Johar Town', city: 'Lahore', area: 'Johar Town', address: 'Block G, Johar Town, Lahore', phone: '042-3456789', timings: '9:00 AM - 9:30 PM', coordinates: { lat: 31.4765, lng: 74.2635 } },
    
    // Islamabad
    { id: 8, name: 'ShopMart Blue Area', city: 'Islamabad', area: 'Blue Area', address: 'Jinnah Avenue, Blue Area, Islamabad', phone: '051-1234567', timings: '10:00 AM - 10:00 PM', coordinates: { lat: 33.7264, lng: 73.0877 } },
    { id: 9, name: 'ShopMart F-11', city: 'Islamabad', area: 'F-11 Markaz', address: 'Markaz F-11, Islamabad', phone: '051-2345678', timings: '9:00 AM - 9:00 PM', coordinates: { lat: 33.6935, lng: 72.9900 } },
    
    // Gujrat
    { id: 10, name: 'ShopMart GT Road', city: 'Gujrat', area: 'GT Road', address: 'GT Road, Gujrat', phone: '053-1234567', timings: '9:00 AM - 9:00 PM', coordinates: { lat: 32.5731, lng: 74.0746 } },
    
    // Sialkot
    { id: 11, name: 'ShopMart Paris Road', city: 'Sialkot', area: 'Paris Road', address: 'Paris Road, Sialkot', phone: '052-1234567', timings: '10:00 AM - 8:00 PM', coordinates: { lat: 32.4945, lng: 74.5314 } },
    
    // Faisalabad
    { id: 12, name: 'ShopMart Susan Road', city: 'Faisalabad', area: 'Susan Road', address: 'Susan Road, Faisalabad', phone: '041-1234567', timings: '9:00 AM - 10:00 PM', coordinates: { lat: 31.4187, lng: 73.0791 } },
    
    // Multan
    { id: 13, name: 'ShopMart Bosan Road', city: 'Multan', area: 'Bosan Road', address: 'Bosan Road, Multan', phone: '061-1234567', timings: '10:00 AM - 9:00 PM', coordinates: { lat: 30.1575, lng: 71.5249 } },
    
    // Peshawar
    { id: 14, name: 'ShopMart Saddar', city: 'Peshawar', area: 'Saddar', address: 'Saddar Road, Peshawar', phone: '091-1234567', timings: '9:00 AM - 9:30 PM', coordinates: { lat: 34.0151, lng: 71.5785 } },
  ];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container-premium py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const cities = ['all', ...Array.from(new Set(stores.map(s => s.city)))];

  const filteredStores = selectedCity === 'all' ? stores : stores.filter(s => s.city === selectedCity);

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Store Locator'}
        subtitle={pageContent?.subtitle || 'Find Your Nearest ShopMart Store'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Store Locator' }]}
      />

      {/* City Filter */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCity === city
                    ? 'bg-primary-600 text-white'
                    : 'bg-luxury-ivory dark:bg-white/10 text-luxury-charcoal dark:text-white hover:bg-primary-100'
                }`}
              >
                {city === 'all' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="section-premium">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-premium p-6 hover:shadow-premium-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{store.name}</h3>
                    <span className="text-xs uppercase tracking-wide text-gold-600">{store.city}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-luxury-ivory dark:bg-white/10">
                    {store.area}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-luxury-muted">{store.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-luxury-muted">{store.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-luxury-muted">{store.timings}</span>
                  </div>
                </div>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Get Directions
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-premium bg-luxury-ivory dark:bg-luxury-slate/30">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Find Us on Map</h2>
          <p className="text-luxury-muted mb-8 max-w-2xl mx-auto">
            Click on any store above to get directions, or use the map below to explore all our locations.
          </p>
          <div className="card-premium p-4 h-96 bg-luxury-line dark:bg-white/5 flex items-center justify-center">
            <p className="text-luxury-muted">Interactive map will be displayed here</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLocator;
