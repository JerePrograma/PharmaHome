import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { MedicamentosProvider } from './hooks/useMedicamentos';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MedicamentosProvider>
        <App />
      </MedicamentosProvider>
    </BrowserRouter>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
