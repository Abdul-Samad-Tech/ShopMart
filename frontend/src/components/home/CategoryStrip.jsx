import { Link } from 'react-router-dom';

const CategoryStrip = ({ categories = [] }) => {
  const items = categories.slice(0, 10);

  if (!items.length) {
    return null;
  }

  return (
    <section className="border-b border-luxury-line bg-white">
      <div className="container-app">
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {items.map((category) => {
            const href = `/products?category=${encodeURIComponent(category.name || '')}`;
            return (
              <Link
                key={category._id || category.slug || category.name}
                to={href}
                className="shrink-0 inline-flex px-3.5 py-1.5 rounded-full text-xs font-semibold text-luxury-charcoal bg-mart-soft active:bg-primary-100 active:text-mart-green whitespace-nowrap"
              >
                {category.name}
              </Link>
            );
          })}
          <Link
            to="/products"
            className="shrink-0 inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-mart-green whitespace-nowrap"
          >
            All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
