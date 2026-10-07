import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { site, themeMode } = useSelector((state) => state.site);
  const accents = site?.theme?.accents;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);

    if (accents) {
      root.style.setProperty('--accent-primary', accents.primary);
      root.style.setProperty('--accent-gold', accents.gold);
      root.style.setProperty('--accent-charcoal', accents.charcoal);
      root.style.setProperty('--accent-cream', accents.cream);
      root.style.setProperty('--accent-midnight', accents.midnight);
      root.style.setProperty('--accent-slate', accents.slate);
    }

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode, accents]);

  return children;
};

export default ThemeProvider;
