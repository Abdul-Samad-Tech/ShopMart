import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteContent } from '../../store/siteSlice';
import { fetchNotifications } from '../../store/notificationSlice';
import { fetchProducts } from '../../store/productSlice';
import PremiumSpinner from '../common/PremiumSpinner';

const AppBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.site);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchSiteContent());
    dispatch(fetchProducts({ limit: 8, sort: 'default' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 60000);
    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <PremiumSpinner label="Loading store" size="lg" fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-surface">
        <div className="card p-10 max-w-md text-center">
          <h2 className="font-display text-2xl mb-3">Unable to connect</h2>
          <p className="text-ink-muted text-sm mb-6">
            In terminal run <code className="text-brand">npm run dev</code> and wait until you see{' '}
            <code className="text-brand">API running</code> and <code className="text-brand">Local: http://localhost:5173</code>.
          </p>
          <p className="text-xs text-red-600/80">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchSiteContent())}
            className="btn-primary mt-6"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AppBootstrap;
