import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store/store';
import { ToastProvider } from '@/components/ui/toast'; // Adjust the import path as needed

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <ToastProvider>
        <App />
      </ToastProvider>
    </StrictMode>
  </Provider>,
);