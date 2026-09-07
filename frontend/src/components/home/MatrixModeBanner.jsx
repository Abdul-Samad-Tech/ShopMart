import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectMatrixModeActive, cycleMatrixMode } from '../../store/uiSlice';

const DISMISS_KEY = 'shopmart_matrix_banner_dismissed';

const MatrixModeBanner = () => {
  const dispatch = useDispatch();
  const active = useSelector(selectMatrixModeActive);
  const override = useSelector((state) => state.ui.matrixModeOverride);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const label =
    override === 'auto'
      ? 'Midnight hours — exclusive night shopping experience'
      : 'Matrix mode on — monochrome luxury with neon accents';

  return (
    <AnimatePresence>
      {active && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-30 border-b border-white/5 bg-black/80 backdrop-blur-md"
        >
          <div className="container-premium py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] md:text-xs text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffaa] animate-pulse shadow-[0_0_8px_#00ffaa]" />
              <span className="uppercase tracking-[0.2em] text-[10px] text-[#00ffaa]/90 font-semibold">
                Night mode active
              </span>
              <span className="hidden sm:inline text-neutral-500">·</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch(cycleMatrixMode())}
                className="text-[10px] uppercase tracking-wide text-neutral-500 hover:text-[#ff0080] transition-colors"
              >
                Cycle mode
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="text-[10px] uppercase tracking-wide text-neutral-600 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatrixModeBanner;
