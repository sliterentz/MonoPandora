import { ReactNode, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

import App from './app/app';

const pageProps = {};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
      <App />
  </StrictMode>
);
