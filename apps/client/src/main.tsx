import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// biome-ignore lint/style/noNonNullAssertion: We are sure the root element exists
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
