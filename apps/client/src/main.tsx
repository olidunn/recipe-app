import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@recipe-app/common/typebox-error-messages.global';

// biome-ignore lint/style/noNonNullAssertion: We are sure the root element exists
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
