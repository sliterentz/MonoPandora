import { Navigate, useRoutes } from 'react-router-dom';
// auth
// import AuthGuard from '../auth/AuthGuard';
// import GuestGuard from '../auth/GuestGuard';
// layouts
import VerticalLayout from '../layouts/main/VerticalLayout';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  HomePage,
  UserPage,
} from './elements';

// ----------------------------------------------------------------------

// export default function Router() {
  const Router = () => {
  return useRoutes([
    // Auth
    {
      path: 'pages',
      children: [
        {
          path: 'login/*',
          element: (
            // <GuestGuard>
              <LoginPage />
            // </GuestGuard>
          ),
        },
        {
          path: 'register/*',
          element: (
            // <GuestGuard>
              <RegisterPage />
            // </GuestGuard>
          ),
        },
        {
          path: 'verify/*',
          element: (
            // <GuestGuard>
              <VerifyCodePage />
            // </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        { path: 'verify-unprotected', element: <VerifyCodePage /> },
        {
          path: 'user/*',
          element: (
            // <GuestGuard>
              <UserPage />
            // </GuestGuard>
          ),
        },
      ],
    },

    // Main Routes
    {
      path: 'dashboard',
      element:(<HomePage />),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

export default Router;