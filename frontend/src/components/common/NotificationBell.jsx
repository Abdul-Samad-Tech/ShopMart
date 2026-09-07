import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNotifications, markRead } from '../../store/notificationSlice';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notifications);
  const unread = items.filter((n) => !n.read).length;

  const handleOpen = () => {
    setOpen(!open);
    if (!open) dispatch(fetchNotifications());
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative p-2.5 rounded-full hover:bg-luxury-ivory dark:hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card-premium z-50 shadow-premium-xl"
            >
              <div className="p-4 border-b border-luxury-line">
                <p className="text-xs uppercase tracking-luxury text-gold-600 font-semibold">Notifications</p>
              </div>
              {items.length === 0 ? (
                <p className="p-4 text-sm text-luxury-muted">No notifications</p>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-luxury-line/50 text-sm ${!n.read ? 'bg-primary-50/50 dark:bg-white/5' : ''}`}
                  >
                    <p className="font-semibold text-luxury-charcoal dark:text-white">{n.title}</p>
                    <p className="text-luxury-muted mt-1">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => {
                          dispatch(markRead(n.id));
                          setOpen(false);
                        }}
                        className="text-primary-700 text-xs mt-2 inline-block hover:underline"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
