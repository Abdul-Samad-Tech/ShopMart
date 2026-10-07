import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { apiEndpoints } from '../services/api';

const GoogleAuthContext = createContext({
  clientId: '',
  ready: false,
});

export const useGoogleAuth = () => useContext(GoogleAuthContext);

const readEnvClientId = () => String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

const isValidClientId = (id) =>
  Boolean(id) && !id.includes('YOUR_CLIENT_ID') && id.includes('.apps.googleusercontent.com');

export default function GoogleAuthProvider({ children }) {
  const envClientId = readEnvClientId();
  const [clientId, setClientId] = useState(isValidClientId(envClientId) ? envClientId : '');
  const [ready, setReady] = useState(isValidClientId(envClientId));

  useEffect(() => {
    if (isValidClientId(envClientId)) return;

    let cancelled = false;
    apiEndpoints
      .getAuthConfig()
      .then(({ data }) => {
        if (cancelled) return;
        const id = String(data?.googleClientId || '').trim();
        if (isValidClientId(id)) setClientId(id);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [envClientId]);

  useEffect(() => {
    if (isValidClientId(envClientId)) setReady(true);
  }, [envClientId]);

  const value = { clientId, ready };

  if (clientId) {
    return (
      <GoogleAuthContext.Provider value={value}>
        <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
      </GoogleAuthContext.Provider>
    );
  }

  return <GoogleAuthContext.Provider value={value}>{children}</GoogleAuthContext.Provider>;
}
