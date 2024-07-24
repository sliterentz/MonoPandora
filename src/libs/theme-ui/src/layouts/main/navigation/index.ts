// ** Icon imports
import Login from 'mdi-material-ui/Login'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import Account from 'mdi-material-ui/Account'
import FolderAccount from 'mdi-material-ui/FolderAccount'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import Cash100 from 'mdi-material-ui/Cash100'

// ** Type import
import { VerticalNavItemsType } from '../../../lib/types/layouts'
// import { PATH_DASHBOARD } from '../../../routes/paths'
import RoleGuard, { hasAccess } from '../../../auth/RoleGuard';
import { AccessGuard } from '../../../auth/AccessGuard'


const menuItems: VerticalNavItemsType = [
  {
    sectionTitle: 'MAIN',
    roles: ['Super Admin', 'Supervisor', 'Employee', 'Client'],
    permissions: ['dashboard'],
  },
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/dashboard',
    permissions: ['dashboard'],
  },
  {
    sectionTitle: 'ADMINISTRATION',
    roles: ['Super Admin', 'Supervisor'],
    permissions: ['user.users.list'],
  },
  {
    title: 'User',
    icon: AccountPlusOutline,
    path: '/pages/user',
    permissions: ['user.users.list'],
    openInNewTab: true
  },
  {
    title: 'Role',
    icon: AccountCogOutline,
    path: '/pages/role',
    permissions: ['user.roles.list'],
    openInNewTab: true
  },
  { 
    title: 'Permission', 
    icon: AccountCogOutline,
    path: '/pages/permission',
    permissions: ['user.permissions.list'],
    openInNewTab: true
  },
  {
    sectionTitle: 'HR Management',
    roles: ['Super Admin', 'Supervisor', 'Employee'],
    permissions: ['employee.employees.list'],
  },
  {
    title: 'Employees',
    icon: Account,
    path: '/pages/employee',
    permissions: ['employee.employees.list'],
    openInNewTab: true
  },
  {
    title: 'Department',
    icon: FolderAccount,
    path: '/pages/department',
    permissions: ['employee.employees.list'],
    openInNewTab: true
  },
  {
    title: 'Projects',
    icon: AccountGroup,
    path: '/pages/project',
    permissions: ['employee.employees.list'],
    openInNewTab: true
  },
  {
    title: 'Payroll',
    icon: Cash100,
    path: '/pages/payroll',
    permissions: ['employee.employees.list'],
    openInNewTab: true
  },
];

const navigation = (): VerticalNavItemsType => {
  const permissions = localStorage.getItem('access') ? localStorage.getItem('access') : null;
  const formatedPermissions = permissions?.slice(1, -1);

  // console.log(roles)

  const filteredMenuItems = menuItems.filter((item) => { 
    if(AccessGuard(item.permissions, formatedPermissions)) {
      return item;
    }
    // return hasAccess(item?.roles , roles)
    // RoleGuard(item.roles, roles) && AccessGuard(item.permissions, permissions)
});

  return (filteredMenuItems);
}

export default navigation
