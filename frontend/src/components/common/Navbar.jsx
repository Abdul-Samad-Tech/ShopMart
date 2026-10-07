import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleTheme } from '../../store/siteSlice';
import { openCommandPalette } from '../../store/uiSlice';
import { openCartDrawer } from '../../store/cartSlice';
import { selectCartTotals } from '../../store/cartSelectors';
import NotificationBell from './NotificationBell';
import MegaMenu from './MegaMenu';
import MobileNavSection from './MobileNavSection';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { quantity } = useSelector(selectCartTotals);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { site, navigation, themeMode } = useSelector((state) => state.site);

  const branding = site?.branding || { siteName: 'ShopMart', tagline: 'Your Neighborhood Superstore' };
  
  const defaultNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Collection', href: '/products', mega: true },
    { label: 'Our Brands', href: '/brands' },
    { label: 'Store Locator', href: '/stores' },
    { label: 'Blog', href: '/blog' },
    { label: 'Events', href: '/events' },
    { label: 'Gift Cards', href: '/gift-cards' },
    { label: 'Loyalty', href: '/loyalty' },
    { label: 'CSR', href: '/csr' },
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ];

  const navItems = defaultNavItems;

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('?')[0]);

  const allowThemeToggle = site?.theme?.allowToggle !== false;
  const megaItem = navItems.find((item) => item.label === megaOpen && item.mega);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass-nav sticky top-0 z-50 relative ${scrolled ? 'glass-nav-scrolled' : ''}`}
      onMouseLeave={() => setMegaOpen(null)}
    >
      <div className="container-premium relative">
        <div className="flex justify-between items-center h-[72px] md:h-20 gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-full hover:bg-surface-raised dark:hover:bg-white/10 text-ink dark:text-white shrink-0"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="flex flex-col group shrink-0">
            <span className="text-2xl font-display font-bold text-ink dark:text-white tracking-tight">
              {branding.siteName?.includes('Mart') ? (
                <>
                  <span className="text-brand">Shop</span>
                  <span className="text-accent">Mart</span>
                </>
              ) : (
                branding.siteName
              )}
            </span>
            {branding.tagline && (
              <span className="text-[10px] uppercase tracking-wide text-ink-muted dark:text-neutral-400 -mt-0.5 hidden sm:block">
                {branding.tagline}
              </span>
            )}
          </Link>

          {/* Desktop Navigation - Hidden, moved to hamburger menu */}
          <nav className="hidden">
            {navItems.map((item) => (
              <div key={item.href + item.label}>
                <Link to={item.href}>{item.label}</Link>
              </div>
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
                className="min-w-11 min-h-11 p-2.5 rounded-full hover:bg-surface-raised text-ink inline-flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {themeMode === 'dark' ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
              </button>
            )}

            <NotificationBell />

            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              className="relative p-2.5 rounded-full hover:bg-surface-raised dark:hover:bg-white/10 text-ink dark:text-white"
              aria-label="Open shopping bag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {quantity > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-accent text-ink rounded-full"
                >
                  {quantity}
                </motion.span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden md:block text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand hover:underline"
                  >
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="hidden sm:flex items-center pl-2 border-l border-line ml-1">
                  <span className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-semibold">
                    {user?.name?.[0] || 'U'}
                  </span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="hidden sm:block ml-2">
                <span className="btn-primary !py-2.5 !px-6 !text-xs">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {megaItem && <MegaMenu item={megaItem} onClose={() => setMegaOpen(null)} />}
      </AnimatePresence>

      {/* Side Drawer Navigation - Left Side */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-96 max-w-[90vw] bg-white dark:bg-chrome z-[100] shadow-2xl"
            >
              <div className="h-full flex flex-col p-6">
                <div className="flex justify-between items-center mb-8 shrink-0">
                  <h2 className="text-xl font-display font-bold">Menu</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-full hover:bg-surface-raised dark:hover:bg-white/10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6 shrink-0">
                  <SearchBar />
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-brand/10 dark:bg-brand/30 text-brand dark:text-brand font-medium'
                          : 'text-ink dark:text-white hover:bg-surface-raised dark:hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {isAuthenticated && user?.role === 'admin' && (
                  <div className="mt-6 pt-6 border-t border-line shrink-0">
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-brand dark:text-brand font-medium hover:bg-brand/10 dark:hover:bg-brand-strong/30"
                    >
                      Admin Panel
                    </Link>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-line shrink-0">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block btn-primary text-center"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
