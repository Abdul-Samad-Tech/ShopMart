import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

export const HERO_MEDIA_SRC = '/Video/ShopHub_grocery_delivery_commerc\u2026_20261007095044.mp4';

/**
 * @param {{ fit?: 'cover' | 'contain' }} props
 * cover fills the banner (default). contain shows the full frame with letterboxing.
 */
const HeroVideo = ({ fit = 'cover' }) => {
  const reduced = usePrefersReducedMotion();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (reduced) {
      video.pause();
      return undefined;
    }
    const play = video.play();
    if (play && typeof play.catch === 'function') play.catch(() => {});
    return undefined;
  }, [reduced]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-chrome" aria-hidden="true">
      <video
        ref={videoRef}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} object-center`}
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={HERO_MEDIA_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-chrome/55" />
    </div>
  );
};

export default HeroVideo;
