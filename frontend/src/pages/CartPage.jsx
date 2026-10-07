import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import PageHeader from '../components/ui/PageHeader';
import { selectCartTotals } from '../store/cartSelectors';

const CartPage = () => {
  const { quantity } = useSelector(selectCartTotals);
  const items = useSelector((state) => state.cart.items);

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <PageHeader title="Your Cart" subtitle="Review items before checkout." />
        <div className="container-premium py-24 text-center">
          <h2 className="font-display text-3xl mb-3">Your bag is empty</h2>
          <Link to="/products" className="btn-primary inline-block mt-6">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Your Bag"
        subtitle={`${quantity} ${quantity === 1 ? 'item' : 'items'} selected`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bag' }]}
      />

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 card p-6 md:p-8">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 md:p-8 sticky top-28 h-fit"
          >
            <h2 className="font-display text-2xl mb-6">Order Summary</h2>
            <OrderSummary />
            <Link to="/products" className="btn-secondary w-full block text-center mt-4">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
