import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
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
  AddUserPage,
  EditUserPage,
  ViewUserProfile,
  RolePage,
  AddRolePage,
  EditRolePage,
  PermissionPage,
  AddPermissionPage,
  EditPermissionPage,
  EmployeePage,
  DepartmentPage,
  ProjectPage,
  PayrollPage,
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
        
        // User Routes
        { path: 'user/*', element: (<AuthGuard><UserPage /></AuthGuard>) },    
        { path: 'user/new/*', element: (<AuthGuard><AddUserPage /></AuthGuard>) },
        { path: 'user/:id/edit/*', element: (<AuthGuard><EditUserPage /></AuthGuard>) },
        { path: 'user/profile/*', element: (<AuthGuard><ViewUserProfile /></AuthGuard>) },
        
        // Role Routes
        { path: 'role/*', element: (<AuthGuard><RolePage /></AuthGuard>) },
        { path: 'role/new/*', element: (<AuthGuard><AddRolePage /></AuthGuard>) },
        { path: 'role/:id/edit/*', element: (<AuthGuard><EditRolePage /></AuthGuard>) },

        // Permission Routes
        { path: 'permission/*', element: (<AuthGuard><PermissionPage /></AuthGuard>) },
        { path: 'permission/new/*', element: (<AuthGuard><AddPermissionPage /></AuthGuard>) },
        { path: 'permission/:id/edit/*', element: (<AuthGuard><EditPermissionPage /></AuthGuard>) },

        {
          path: 'employee/*',
          element: (
            <AuthGuard>
              <EmployeePage />
            </AuthGuard>
          ),
        },
        {
          path: 'department/*',
          element: (
            <AuthGuard>
              <DepartmentPage />
            </AuthGuard>
          ),
        },
        {
          path: 'project/*',
          element: (
            <AuthGuard>
              <ProjectPage />
            </AuthGuard>
          ),
        },
        {
          path: 'payroll/*',
          element: (
            <AuthGuard>
              <PayrollPage />
            </AuthGuard>
          ),
        },
      ],
    },

    // Main Routes
    {
      path: 'dashboard',
      element:(
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

export default Router;
