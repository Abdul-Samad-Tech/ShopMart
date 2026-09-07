import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeSectionHeader = ({ eyebrow, title, subtitle, href, ctaLabel = 'View all' }) => {
  return (
    <div className="flex items-end justify-between gap-3 mb-5 md:mb-8">
      <div>
        {eyebrow ? (
          <p className="text-[10px] uppercase tracking-[0.18em] text-mart-green font-bold mb-1">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-2xl md:text-3xl font-bold text-luxury-charcoal dark:text-white">{title}</h2>
        {subtitle ? (
          <p className="text-luxury-muted dark:text-mono-muted mt-1.5 max-w-xl text-sm md:text-base hidden sm:block">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          to={href}
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-mart-green shrink-0"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
};

export default HomeSectionHeader;
