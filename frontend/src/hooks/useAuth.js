import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout, registerStart, registerSuccess, registerFailure } from '../store/authSlice';
import { apiEndpoints } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const login = async (credentials) => {
    dispatch(loginStart());
    try {
      const response = await apiEndpoints.login(credentials);
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token,
      }));
      return { success: true };
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    dispatch(registerStart());
    try {
      const response = await apiEndpoints.register(userData);
      dispatch(registerSuccess({
        user: response.data.user,
        token: response.data.token,
      }));
      return { success: true };
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || 'Registration failed'));
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
  };
};
