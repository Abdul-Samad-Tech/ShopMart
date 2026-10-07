import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { closeCommandPalette, openCommandPalette } from '../../store/uiSlice';
import { openCartDrawer } from '../../store/cartSlice';
import { toggleTheme } from '../../store/siteSlice';

const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((state) => state.ui.commandPaletteOpen);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  const actions = useMemo(
    () => [
      { id: 'home', label: 'Go to Home', hint: 'Navigate', run: () => navigate('/') },
      { id: 'shop', label: 'Shop all products', hint: 'Navigate', run: () => navigate('/products') },
      { id: 'cart', label: 'Open shopping cart', hint: 'Cart', run: () => dispatch(openCartDrawer()) },
      { id: 'checkout', label: 'Checkout', hint: 'Navigate', run: () => navigate('/checkout') },
      { id: 'dashboard', label: 'My account', hint: 'Navigate', run: () => navigate('/dashboard') },
      { id: 'contact', label: 'Contact support', hint: 'Navigate', run: () => navigate('/contact') },
      { id: 'dark', label: 'Toggle dark / light theme', hint: 'Theme', run: () => dispatch(toggleTheme()) },
    ],
    [dispatch, navigate]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setIndex(0);
  }, [query, open]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(openCommandPalette());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeCommandPalette());
    setQuery('');
  }, [dispatch]);

  const runAction = (action) => {
    action.run();
    close();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && filtered[index]) {
        e.preventDefault();
        runAction(filtered[index]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, index, close]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            className="fixed left-1/2 top-[18%] z-[101] w-[min(92vw,520px)] -translate-x-1/2 glass-panel glass-panel-light dark:glass-panel-dark rounded-2xl shadow-rest-lg overflow-hidden"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command… (shop, cart, theme)"
              className="w-full px-5 py-4 bg-transparent border-b border-white/10 text-white placeholder:text-white/40 outline-none text-sm"
            />
            <ul className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <li className="px-5 py-3 text-sm text-white/50">No matches</li>
              ) : (
                filtered.map((action, i) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      onClick={() => runAction(action)}
                      className={`w-full flex justify-between items-center px-5 py-3 text-left text-sm transition-colors ${
                        i === index ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span>{action.label}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">{action.hint}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="px-5 py-2 text-[10px] text-white/30 border-t border-white/10">
              ↑↓ navigate · Enter run · Esc close · Ctrl+K open
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
