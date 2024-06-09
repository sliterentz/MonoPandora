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

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'MAIN'
    },
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      sectionTitle: 'ADMINISTRATION'
    },
    {
      title: 'User',
      icon: AccountPlusOutline,
      path: '/pages/user',
      openInNewTab: true
    },
    {
      title: 'Role',
      icon: AccountCogOutline,
      path: '/pages/role',
      openInNewTab: true
    },
    {
      sectionTitle: 'HR Management'
    },
    {
      title: 'Employees',
      icon: Account,
      path: '/pages/employee',
      openInNewTab: true
    },
    {
      title: 'Department',
      icon: FolderAccount,
      path: '/pages/department',
      openInNewTab: true
    },
    {
      title: 'Projects',
      icon: AccountGroup,
      path: '/pages/project',
      openInNewTab: true
    },
    {
      title: 'Payroll',
      icon: Cash100,
      path: '/pages/payroll',
      openInNewTab: true
    },
  ]
}

export default navigation
