import { Suspense, lazy, ElementType } from 'react';
import { Routes, Route } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';

const LoginPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/login'));
const RegisterPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/register'));
const VerifyCodePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/verify'));
const HomePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/HomePage'));
const UserPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user'));
const AddUserPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user/UserAddPage'));
const EditUserPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user/UserEditPage'));
const ViewUserProfileRoute = lazy(() => import('../../../../apps/react-dashboard/src/sections/user/UserDetailForm'));
const RolePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role'));
const AddRolePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role/RoleAddPage'));
const EditRolePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role/RoleEditPage'));
const PermissionPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission'));
const AddPermissionPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission/PermissionAddPage'));
const EditPermissionPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission/PermissionEditPage'));
const EmployeePageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/employee'));
const DepartmentPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/department'));
const ProjectPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/project'));
const PayrollPageRoute = lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/payroll'));

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
    {/* <Suspense fallback={<div className="container">Loading...</div>}> */}
      <Component {...props} />
      <Routes>
        <Route path="/pages/login" element={<LoginPageRoute />} />
        <Route path="/pages/register" element={<RegisterPageRoute />} />
        <Route path="/pages/verify" element={<VerifyCodePageRoute />} />
        <Route path="/home" element={<HomePageRoute />} />
        <Route path="/pages/user" element={<UserPageRoute />} />
        <Route path="/pages/user/new" element={<AddUserPageRoute />} />
        <Route path="/pages/user/:id/edit"  element={<EditUserPageRoute />} />
        <Route path="/pages/user/profile" element={<ViewUserProfileRoute />} />
        <Route path="/pages/role" element={<RolePageRoute />} />
        <Route path="/pages/role/new" element={<AddRolePageRoute />} />
        <Route path="/pages/role/:id/edit"  element={<EditRolePageRoute />} />
        <Route path="/pages/permission" element={<PermissionPageRoute />} />
        <Route path="/pages/permission/new" element={<AddPermissionPageRoute />} />
        <Route path="/pages/permission/:id/edit"  element={<EditPermissionPageRoute />} />
        <Route path="/pages/employee" element={<EmployeePageRoute />} />
        <Route path="/pages/department" element={<DepartmentPageRoute />} />
        <Route path="/pages/project" element={<ProjectPageRoute />} />
        <Route path="/pages/payroll" element={<PayrollPageRoute />} />
      </Routes>
    </Suspense>

  );

// ----------------------------------------------------------------------

// Lazy Pages
export const LoginPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/login')));
export const RegisterPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/register')));
export const VerifyCodePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/verify')));
export const HomePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/HomePage')));
export const UserPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user')));
export const AddUserPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user/UserAddPage')));
export const EditUserPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/user/UserEditPage')));
export const ViewUserProfile = Loadable(lazy(() => import('../../../../apps/react-dashboard/src/sections/user/UserDetailForm')));
export const RolePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role')));
export const AddRolePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role/RoleAddPage')));
export const EditRolePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/role/RoleEditPage')));
export const PermissionPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission')));
export const AddPermissionPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission/PermissionAddPage')));
export const EditPermissionPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/permission/PermissionEditPage')));
export const EmployeePage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/employee')));
export const DepartmentPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/department')));
export const ProjectPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/project')));
export const PayrollPage = Loadable(lazy(() => import('../../../../../src/apps/react-dashboard/src/pages/payroll')));
