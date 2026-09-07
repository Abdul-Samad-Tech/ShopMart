import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const overlayTone = {
  green: 'from-[#052e1a]/92 via-[#005c2e]/55 to-transparent',
  orange: 'from-[#431407]/90 via-[#9a3412]/50 to-transparent',
  dark: 'from-black/92 via-black/55 to-transparent',
  soft: 'from-[#171717]/88 via-black/45 to-transparent',
};

const accentTone = {
  green: 'bg-mart-accent',
  orange: 'bg-mart-orange',
  dark: 'bg-white/80',
  soft: 'bg-mart-accent',
};

const CinematicPageSection = ({
  label,
  title,
  description,
  href,
  cta,
  image,
  tone = 'green',
  reverse = false,
  children,
  meta,
  index = 0,
  variant = 'cinematic',
}) => {
  const sectionNumber = String(index + 1).padStart(2, '0');
  const isSplit = variant === 'split';

  if (isSplit) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
        className={`section-compact border-y border-luxury-line dark:border-mono-line ${
          index % 2 === 0 ? 'bg-white dark:bg-mono-surface' : 'bg-mart-soft dark:bg-mono-elevated'
        }`}
      >
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center">
            <div className={`${reverse ? 'md:order-2 md:text-right md:items-end' : 'md:order-1'}`}>
              <div className={`flex items-center gap-3 mb-4 ${reverse ? 'md:justify-end' : ''}`}>
                <span className="text-xs font-display font-bold text-mart-green/40">{sectionNumber}</span>
                <span className="h-px w-8 bg-mart-orange" />
                <p className="text-[11px] uppercase tracking-[0.24em] text-mart-orange font-semibold">
                  {label}
                </p>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-luxury-charcoal dark:text-white leading-[1.1]">
                {title}
              </h2>

              {description ? (
                <p
                  className={`mt-4 text-sm sm:text-base text-luxury-muted dark:text-mono-muted leading-relaxed max-w-md ${
                    reverse ? 'md:ml-auto' : ''
                  }`}
                >
                  {description}
                </p>
              ) : null}

              {meta ? (
                <div className={`mt-4 ${reverse ? 'md:flex md:justify-end' : ''}`}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-luxury-line dark:border-mono-line bg-white dark:bg-mono-surface px-3.5 py-1.5 text-sm text-luxury-muted dark:text-mono-muted shadow-sm">
                    {meta}
                  </div>
                </div>
              ) : null}

              {children ? (
                <div className={`mt-5 ${reverse ? 'md:flex md:justify-end' : ''}`}>{children}</div>
              ) : null}

              <div className={`mt-7 flex flex-wrap gap-3 ${reverse ? 'md:justify-end' : ''}`}>
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 rounded-full bg-mart-green text-white px-6 py-3 text-sm font-bold hover:bg-mart-green-dark transition-colors"
                >
                  {cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 rounded-full border border-luxury-line dark:border-mono-line bg-white dark:bg-mono-surface px-5 py-3 text-sm font-semibold text-luxury-charcoal dark:text-white hover:border-mart-green/40 transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`relative aspect-[16/11] md:aspect-[5/4] overflow-hidden rounded-[1.75rem] shadow-cinematic border border-luxury-line/70 dark:border-mono-line/70 ${
                reverse ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7 }}
      className="cinematic-section relative min-h-[64vh] sm:min-h-[68vh] md:min-h-[560px] overflow-hidden"
    >
      <motion.img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        loading="lazy"
      />

      <div className="absolute inset-0 bg-black/30" />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          reverse ? 'md:bg-gradient-to-l' : ''
        } ${overlayTone[tone] || overlayTone.green}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />
      <div className="cinematic-section__vignette absolute inset-0 pointer-events-none" />
      <div className="cinematic-section__grain absolute inset-0 pointer-events-none opacity-[0.14]" />

      <span
        className={`absolute top-8 md:top-12 font-display text-7xl md:text-8xl font-bold text-white/[0.07] leading-none select-none ${
          reverse ? 'right-6 md:right-12' : 'left-6 md:left-12'
        }`}
        aria-hidden
      >
        {sectionNumber}
      </span>

      <div className="container-app relative z-10 min-h-[64vh] sm:min-h-[68vh] md:min-h-[560px] flex items-end md:items-center py-14 md:py-20">
        <div className={`w-full max-w-2xl ${reverse ? 'md:ml-auto' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`cinematic-panel ${reverse ? 'md:ml-auto' : ''}`}
          >
            <div className={`flex items-center gap-3 mb-5 ${reverse ? 'md:justify-end' : ''}`}>
              <span className={`h-px w-8 ${accentTone[tone] || accentTone.green}`} />
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/80 font-semibold">
                {label}
              </p>
            </div>

            <h2
              className={`font-display text-3xl sm:text-4xl md:text-[3.25rem] font-bold text-white leading-[1.08] tracking-tight ${
                reverse ? 'md:text-right' : ''
              }`}
            >
              {title}
            </h2>

            {description ? (
              <p
                className={`mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-white/82 leading-relaxed max-w-md ${
                  reverse ? 'md:ml-auto md:text-right' : ''
                }`}
              >
                {description}
              </p>
            ) : null}

            {meta ? (
              <div className={`mt-4 text-sm text-white/75 ${reverse ? 'md:flex md:justify-end' : ''}`}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
                  {meta}
                </div>
              </div>
            ) : null}

            {children ? (
              <div className={`mt-5 ${reverse ? 'md:flex md:justify-end' : ''}`}>{children}</div>
            ) : null}

            <div className={`mt-8 flex flex-wrap items-center gap-3 ${reverse ? 'md:justify-end' : ''}`}>
              <Link to={href} className="cinematic-cta group">
                <span>{cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to={href}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                Learn more
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CinematicPageSection;
