import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { apiEndpoints } from '../services/api';
import { hydrateCart, openCartDrawer } from '../store/cartSlice';
import Loader from '../components/common/Loader';
import PageHeader from '../components/ui/PageHeader';

const GhostCartPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiEndpoints
      .getGhostCart(token)
      .then((res) => {
        const items = (res.data.items || []).map((i) => ({
          ...i,
          totalPrice: i.price * i.quantity,
        }));
        dispatch(
          hydrateCart({
            items,
            totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
            totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
            isDrawerOpen: true,
          })
        );
        toast.success('Shared cart loaded!');
        navigate('/products', { replace: true });
        dispatch(openCartDrawer());
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Invalid or expired link');
      })
      .finally(() => setLoading(false));
  }, [token, dispatch, navigate]);

  if (loading) return <Loader label="Loading shared cart" fullScreen />;

  return (
    <div className="page-shell">
      <PageHeader title="Ghost Cart" subtitle="Shared shopping bag" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shared cart' }]} />
      <div className="container-premium py-16 text-center">
        <p className="text-ink-muted mb-6">{error}</p>
        <Link to="/products" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default GhostCartPage;
