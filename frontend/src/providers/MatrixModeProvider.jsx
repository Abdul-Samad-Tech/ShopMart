import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectMatrixModeActive } from '../store/uiSlice';

const MatrixModeProvider = ({ children }) => {
  const active = useSelector(selectMatrixModeActive);

  useEffect(() => {
    document.documentElement.classList.toggle('matrix-mode', active);
    return () => document.documentElement.classList.remove('matrix-mode');
  }, [active]);

  return children;
};

export default MatrixModeProvider;
