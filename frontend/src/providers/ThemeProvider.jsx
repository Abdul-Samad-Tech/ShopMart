import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const themeMode = useSelector((state) => state.site.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  return children;
};

export default ThemeProvider;
