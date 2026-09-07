const HeroBackground = ({ hero }) => {
  if (!hero) return null;

  const { backgroundType, backgroundImage, backgroundVideo, lottieUrl } = hero;

  if (backgroundType === 'video' && backgroundVideo) {
    return (
      <>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          poster={backgroundImage || undefined}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal/90 via-luxury-charcoal/70 to-luxury-charcoal/50" />
      </>
    );
  }

  if (backgroundType === 'lottie' && lottieUrl) {
    return (
      <>
        <iframe
          title="Hero animation"
          src={lottieUrl}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 border-0"
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
      </>
    );
  }

  if (backgroundType === 'gradient') {
    return <div className="absolute inset-0 bg-gradient-mart" />;
  }

  if (backgroundImage) {
    return (
      <>
        <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal/92 via-luxury-charcoal/75 to-primary-950/60" />
      </>
    );
  }

  return <div className="absolute inset-0 bg-gradient-mart" />;
};

export default HeroBackground;
