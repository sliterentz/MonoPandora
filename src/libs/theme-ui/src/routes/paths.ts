// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
  }
  
  const ROOTS_AUTH = '/auth';
  const ROOTS_DASHBOARD = '/dashboard';
  
  // ----------------------------------------------------------------------
  
  export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    verify: path(ROOTS_AUTH, '/verify'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    newPassword: path(ROOTS_AUTH, '/new-password'),
  };
  
  export const PATH_PAGE = {
    page403: '/403',
    page404: '/404',
    page500: '/500',
    components: '/components',
  };
  
  export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    general: {
      app: path(ROOTS_DASHBOARD, '/app'),
    },
    user: {
      root: path(ROOTS_DASHBOARD, '/user'),
      new: path(ROOTS_DASHBOARD, '/user/new'),
      list: path(ROOTS_DASHBOARD, '/user/list'),
      profile: path(ROOTS_DASHBOARD, '/user/profile'),
      edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    },
  };