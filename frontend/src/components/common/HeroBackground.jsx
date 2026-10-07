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
        <div className="absolute inset-0 bg-gradient-to-r from-chrome/90 via-chrome/70 to-chrome/50" />
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
        <div className="absolute inset-0 bg-surface/80" />
      </>
    );
  }

  if (backgroundType === 'gradient') {
    return <div className="absolute inset-0 bg-brand" />;
  }

  if (backgroundImage) {
    return (
      <>
        <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-chrome/92 via-chrome/75 to-brand/60" />
      </>
    );
  }

  return <div className="absolute inset-0 bg-brand" />;
};

export default HeroBackground;
