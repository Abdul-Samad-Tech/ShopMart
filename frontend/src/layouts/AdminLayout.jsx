import { NavLink, Outlet, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  MessageSquare,
  Ticket,
  Gift,
  CreditCard,
  FileText,
  Folder,
} from 'lucide-react';
import { signOut } from '../store/authSlice';

const links = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Folder },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/promo-codes', label: 'Promo Codes', icon: Ticket },
  { to: '/admin/gift-cards', label: 'Gift Cards', icon: Gift },
  { to: '/admin/loyalty-cards', label: 'Loyalty Cards', icon: CreditCard },
  { to: '/admin/page-content', label: 'Page Content', icon: FileText },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-shrink-0 p-4">
          <div className="admin-sidebar w-full sticky top-4 h-[calc(100vh-2rem)]">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 mb-6">
              <Store className="w-5 h-5 text-brand" />
              <span className="font-display text-xl tracking-wide">ShopMart</span>
              <span className="text-[10px] uppercase tracking-widest text-brand/80 ml-auto">Admin</span>
            </Link>
            <nav className="flex-1 space-y-1">
              {links.map(({ to, end, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => (isActive ? 'admin-nav-link-active' : 'admin-nav-link')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              className="admin-nav-link mt-auto text-red-300/90 hover:text-red-200"
              onClick={() => {
                dispatch(signOut());
                navigate('/');
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            {links.map(({ to, end, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
