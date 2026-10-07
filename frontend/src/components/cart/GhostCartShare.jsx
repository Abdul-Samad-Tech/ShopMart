import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../../services/api';

const GhostCartShare = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');

  const share = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      const { data } = await apiEndpoints.saveGhostCart({ items });
      setLink(data.url);
      await navigator.clipboard.writeText(data.url);
      toast.success('Cart link copied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save cart');
    } finally {
      setLoading(false);
    }
  };

  const whatsappShare = () => {
    if (!link) return;
    const text = encodeURIComponent(`My ShopMart cart — open this link:\n${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-xl border border-line dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Ghost Cart</p>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted mt-0.5">
          Save or share your bag — no login required. Link valid 7 days.
        </p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={share}
        disabled={loading || !items.length}
        className="btn-secondary w-full !text-xs !py-2.5"
      >
        {loading ? 'Creating link…' : 'Copy shareable cart link'}
      </motion.button>
      {link && (
        <div className="space-y-2">
          <p className="text-[10px] text-ink-muted break-all">{link}</p>
          <button type="button" onClick={whatsappShare} className="text-xs text-brand font-semibold hover:underline">
            Share on WhatsApp →
          </button>
        </div>
      )}
    </div>
  );
};

export default GhostCartShare;
