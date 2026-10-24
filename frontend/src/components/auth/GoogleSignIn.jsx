import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
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

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  return (user) => {
    if (user?.role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };
};

const GoogleButton = () => {
  const dispatch = useDispatch();
  const redirect = useAuthRedirect();

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        toast.error('Google sign-in failed');
        return;
      }
      dispatch(loginStart());
      try {
        const { data } = await apiEndpoints.googleLogin({ accessToken: tokenResponse.access_token });
        dispatch(loginSuccess(data));
        toast.success(data.isNewUser ? 'Welcome! Check your email.' : 'Signed in with Google.');
        redirect(data.user);
      } catch (err) {
        const msg = getApiErrorMessage(err, 'Google sign-in failed');
        dispatch(loginFailure(msg));
        toast.error(msg);
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled. If it keeps failing, add this site in Google Cloud authorized origins.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      aria-label="Continue with Google"
      className="flex min-h-11 w-full items-center justify-center gap-3 rounded-full bg-white px-4 text-sm font-semibold text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <GoogleMark />
      Continue with Google
    </button>
  );
};

const GoogleSignIn = () => {
  const { clientId, ready } = useGoogleAuth();

  return (
    <div className="space-y-3 pt-1">
      <GoogleOriginHint />

      {!ready && !clientId ? (
        <div className="flex min-h-11 w-full items-center justify-center text-sm text-white/60 animate-pulse">
          Loading Google…
        </div>
      ) : clientId ? (
        <GoogleButton />
      ) : (
        <p className="text-center text-xs text-white/60">Google Sign-In not configured in .env</p>
      )}
    </div>
  );
};

export default GoogleSignIn;
