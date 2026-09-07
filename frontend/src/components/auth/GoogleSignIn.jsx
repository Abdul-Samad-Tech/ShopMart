import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { apiEndpoints } from '../../services/api';
import { useGoogleAuth } from '../../providers/GoogleAuthProvider';
import { getApiErrorMessage } from '../../utils/apiError';

const GoogleOriginHint = () => {
  if (!import.meta.env.DEV) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  if (!origin) return null;

  return (
    <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      Dev: add <code className="font-mono">{origin}</code> to Google Cloud → OAuth → Authorized JavaScript origins.
    </p>
  );
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  return (user) => {
    if (user?.role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };
};

const GoogleSignIn = () => {
  const dispatch = useDispatch();
  const redirect = useAuthRedirect();
  const { clientId, ready } = useGoogleAuth();

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      toast.error('Google sign-in failed');
      return;
    }
    dispatch(loginStart());
    try {
      const { data } = await apiEndpoints.googleLogin({ credential: response.credential });
      dispatch(loginSuccess(data));
      toast.success(data.isNewUser ? 'Welcome! Check your email.' : 'Signed in with Google.');
      redirect(data.user);
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Google sign-in failed');
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-3 pt-1">
      <GoogleOriginHint />
      <div className="divider-premium">
        <span className="text-xs uppercase tracking-wide text-luxury-muted">or</span>
      </div>

      {!ready && !clientId ? (
        <div className="google-signin-btn animate-pulse opacity-70">Loading Google…</div>
      ) : clientId ? (
        <div className="w-full flex justify-center min-h-[44px]">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error('Google sign-in cancelled')}
            theme="outline"
            size="large"
            text="continue_with"
            shape="pill"
            width="100%"
          />
        </div>
      ) : (
        <p className="text-xs text-center text-luxury-muted">Google Sign-In not configured in .env</p>
      )}
    </div>
  );
};

export default GoogleSignIn;
