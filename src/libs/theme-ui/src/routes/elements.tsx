import { Suspense, lazy, ElementType } from 'react';
import { Routes, Route } from 'react-router-dom';
// components
// import LoadingScreen from '../components/loading-screen';

const LoginPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/login'));
const RegisterPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/register'));
const VerifyCodePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/verify'));
const HomePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/HomePage'));
const UserPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user'));

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    // <Suspense fallback={<LoadingScreen />}>
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Component {...props} />
      <Routes>
        <Route path="/pages/login" element={<LoginPageRoute />} />
        <Route path="/pages/register" element={<RegisterPageRoute />} />
        <Route path="/pages/verify" element={<VerifyCodePageRoute />} />
        <Route path="/home" element={<HomePageRoute />} />
        <Route path="/pages/user" element={<UserPageRoute />} />
      </Routes>
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/login')));
export const RegisterPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/register')));
export const VerifyCodePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/verify')));
export const HomePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/HomePage')));
export const UserPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user')));