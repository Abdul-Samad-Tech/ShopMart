import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import store from './store/store';
import ThemeProvider from './providers/ThemeProvider';
import GoogleAuthProvider from './providers/GoogleAuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <GoogleAuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1816',
                color: '#faf8f5',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '14px 18px',
              },
              success: { iconTheme: { primary: '#c9a227', secondary: '#1a1816' } },
            }}
          />
        </GoogleAuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
