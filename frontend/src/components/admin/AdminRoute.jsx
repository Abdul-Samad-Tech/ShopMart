import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  if (!isAuthenticated) {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    localStorage.removeItem('user');
    return <Navigate to="/login?redirect=admin" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
