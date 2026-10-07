import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNavSection = ({ item, onClose }) => {
  const [open, setOpen] = useState(false);
  const hasSub = item.mega || item.children?.length || item.columns?.length;

  if (!hasSub) {
    return (
      <Link to={item.href} onClick={onClose} className="text-lg font-display py-2 block">
        {item.label}
      </Link>
    );
  }

  const allLinks = [
    ...(item.columns || []).flatMap((col) =>
      (col.links || []).map((l) => ({ ...l, group: col.title }))
    ),
    ...(item.children || []).map((c) => ({ label: c.label, href: c.href, group: 'Quick' })),
  ];

  return (
    <div className="border-b border-line/60 pb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-lg font-display py-2"
      >
        {item.label}
        <span className={`text-sm transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-3 space-y-2 pb-2"
          >
            <Link
              to={item.href}
              onClick={onClose}
              className="text-sm font-semibold text-brand block py-1"
            >
              All {item.label}
            </Link>
            {allLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                onClick={onClose}
                className="text-sm text-ink-muted hover:text-ink block py-1"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavSection;
