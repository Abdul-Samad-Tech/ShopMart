import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleTheme } from '../../store/siteSlice';
import { openCartDrawer } from '../../store/cartSlice';
import { selectCartTotals } from '../../store/cartSelectors';
import NotificationBell from './NotificationBell';
import MegaMenu from './MegaMenu';
import MobileNavSection from './MobileNavSection';
import SearchBar from '../search/SearchBar';
import { SIDEBAR_NAV_ITEMS } from './nav.constant';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { quantity } = useSelector(selectCartTotals);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { site, themeMode } = useSelector((state) => state.site);

  const branding = site?.branding || {
    siteName: 'ShopMart',
    tagline: 'Your Neighborhood Superstore',
  };

  const navItems = SIDEBAR_NAV_ITEMS;
  const allowThemeToggle = site?.theme?.allowToggle !== false;
  const megaItem = navItems.find((item) => item.label === megaOpen && item.mega);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('?')[0]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass-nav sticky top-0 z-50 relative ${scrolled ? 'glass-nav-scrolled' : ''}`}
      onMouseLeave={() => setMegaOpen(null)}
    >
      <div className="container-premium relative">
        <div className="flex justify-between items-center h-14 sm:h-[72px] md:h-20 gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-full hover:bg-mart-soft dark:hover:bg-white/10 text-mart-ink dark:text-white shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex flex-col group shrink-0">
            <span className="text-2xl font-display font-bold tracking-tight">
              {branding.siteName?.includes('Mart') ? (
                <>
                  <span className="text-mart-green">Shop</span>
                  <span className="text-mart-orange">Mart</span>
                </>
              ) : (
                <span className="text-mart-ink dark:text-white">{branding.siteName}</span>
              )}
            </span>
            {branding.tagline && (
              <span className="text-[10px] uppercase tracking-luxury text-luxury-muted dark:text-neutral-400 -mt-0.5 hidden sm:block">
                {branding.tagline}
              </span>
            )}
          </Link>

          <nav className="hidden" aria-hidden>
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex justify-center max-w-md mx-2 hidden md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {allowThemeToggle && (
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-full hover:bg-mart-soft dark:hover:bg-white/10 text-mart-ink dark:text-white text-xs font-semibold"
                aria-label="Toggle theme"
              >
                {themeMode === 'dark' ? 'Light' : 'Dark'}
              </button>
            )}

            <NotificationBell />

            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              className="relative p-2.5 rounded-full hover:bg-mart-soft dark:hover:bg-white/10 text-mart-ink dark:text-white"
              aria-label="Open shopping bag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              <AnimatePresence>
                {quantity > 0 && (
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-mart-orange text-white rounded-full"
                  >
                    {quantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden md:block text-xs font-semibold uppercase tracking-wide text-mart-green hover:underline"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center pl-2 border-l border-luxury-line ml-1"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-mart-green-dark flex items-center justify-center text-sm font-semibold">
                    {user?.name?.[0] || 'U'}
                  </span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="hidden sm:block ml-2">
                <span className="btn-premium !py-2.5 !px-6 !text-xs">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {megaItem && <MegaMenu item={megaItem} onClose={() => setMegaOpen(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 left-0 h-screen w-96 max-w-[90vw] bg-white dark:bg-mono-surface z-[100] shadow-2xl"
              aria-label="Site navigation"
            >
              <div className="h-full flex flex-col p-6">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <div>
                    <h2 className="text-xl font-display font-bold">
                      <span className="text-mart-green">Shop</span>
                      <span className="text-mart-orange">Mart</span>
                    </h2>
                    <p className="text-xs text-luxury-muted mt-1">Browse all pages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-mart-soft dark:hover:bg-white/10"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-5 shrink-0 md:hidden">
                  <SearchBar />
                </div>

                <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
                  {navItems.map((item) =>
                    item.mega ? (
                      <MobileNavSection
                        key={item.href + item.label}
                        item={item}
                        onClose={() => setSidebarOpen(false)}
                      />
                    ) : (
                      <Link
                        key={item.href + item.label}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-4 py-3 rounded-xl transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-mart-green font-semibold dark:bg-primary-950/40 dark:text-primary-300'
                            : 'text-mart-ink dark:text-white hover:bg-mart-soft dark:hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>

                {isAuthenticated && user?.role === 'admin' && (
                  <div className="mt-4 pt-4 border-t border-luxury-line shrink-0">
                    <Link
                      to="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="block px-4 py-3 rounded-xl text-mart-green font-medium hover:bg-primary-50"
                    >
                      Admin Panel
                    </Link>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-luxury-line shrink-0">
                    <Link
                      to="/login"
                      onClick={() => setSidebarOpen(false)}
                      className="block btn-premium text-center"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
