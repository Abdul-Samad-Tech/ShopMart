import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MartHero from '../components/home/MartHero';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedProductGrid from '../components/home/FeaturedProductGrid';
import DynamicHubSections from '../components/home/DynamicHubSections';
import {
  MART_TRUST,
  FEATURED_PRODUCT_LIMIT,
  HOME_PAGE_STORIES,
} from '../components/home/home.constant';
import { fetchProducts } from '../store/productSlice';
import { apiEndpoints } from '../services/api';
import { IconShipping, IconReturns, IconSecure } from '../components/ui/TrustIcons';

const trustIconMap = {
  shipping: IconShipping,
  returns: IconReturns,
  secure: IconSecure,
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { site, categories } = useSelector((state) => state.site);
  const { filteredProducts, products, loading } = useSelector((state) => state.products);
  const branding = site?.branding;
  const hero = site?.hero || {};

  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [pageContent, setPageContent] = useState({});

  const catalog = (filteredProducts?.length ? filteredProducts : products) || [];
  const featuredProducts = catalog.slice(0, FEATURED_PRODUCT_LIMIT);

  useEffect(() => {
    dispatch(fetchProducts({ limit: FEATURED_PRODUCT_LIMIT, sort: 'default' }));
  }, [dispatch]);

  useEffect(() => {
    let active = true;

    const loadHubData = async () => {
      const [brandsRes, storesRes, blogRes, eventsRes, ...pageResults] = await Promise.allSettled([
        apiEndpoints.getBrands({ limit: 8, active: 'true' }),
        apiEndpoints.getStores({ limit: 3, active: 'true' }),
        apiEndpoints.getBlogPosts({ limit: 3 }),
        apiEndpoints.getEvents({ limit: 4, active: 'true' }),
        ...HOME_PAGE_STORIES.map((story) => apiEndpoints.getPageContent(story.key)),
      ]);

      if (!active) return;

      if (brandsRes.status === 'fulfilled') {
        setBrands(brandsRes.value.data?.brands || brandsRes.value.data || []);
      }
      if (storesRes.status === 'fulfilled') {
        setStores(storesRes.value.data?.stores || storesRes.value.data || []);
      }
      if (blogRes.status === 'fulfilled') {
        setBlogPosts(blogRes.value.data?.posts || blogRes.value.data || []);
      }
      if (eventsRes.status === 'fulfilled') {
        setEvents(eventsRes.value.data?.events || eventsRes.value.data || []);
      }

      const nextPages = {};
      pageResults.forEach((result, index) => {
        const key = HOME_PAGE_STORIES[index]?.key;
        if (!key) return;
        if (result.status === 'fulfilled') {
          nextPages[key] = result.value.data;
        } else {
          nextPages[key] = null;
        }
      });
      setPageContent(nextPages);
    };

    loadHubData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-shell app-shell">
      <MartHero branding={branding} hero={hero} />
      <CategoryShowcase categories={categories} />
      <FeaturedProductGrid products={featuredProducts} loading={loading} />
      <DynamicHubSections
        brands={brands}
        stores={stores}
        blogPosts={blogPosts}
        events={events}
        pageContent={pageContent}
      />

      <section className="border-t border-luxury-line dark:border-mono-line bg-white dark:bg-mono-surface">
        <div className="container-app py-8 md:py-12">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            {MART_TRUST.map((item) => {
              const Icon = trustIconMap[item.icon] || IconShipping;
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-3 text-luxury-charcoal dark:text-white rounded-2xl bg-mart-soft dark:bg-mono-elevated px-4 py-3.5"
                >
                  <span className="w-10 h-10 rounded-xl bg-white dark:bg-mono-surface text-mart-green flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
