// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
  }

  const ROOTS_AUTH = '/auth';
  const ROOTS_DASHBOARD = '/dashboard';
  const ROOTS_PAGES = '/pages'

  // ----------------------------------------------------------------------

  export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_PAGES, '/login'),
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
      root: path(ROOTS_PAGES, '/user'),
      new: path(ROOTS_PAGES, '/user/new'),
      list: path(ROOTS_PAGES, '/user/list'),
      profile: path(ROOTS_PAGES, '/user/profile'),
      edit: (id: string) => path(ROOTS_PAGES, `/user/${id}/edit`),
    },
    role: {
      root: path(ROOTS_PAGES, '/role'),
      new: path(ROOTS_PAGES, '/role/new'),
      list: path(ROOTS_PAGES, '/role/list'),
      view: (id: number) => path(ROOTS_PAGES, `/role/${id}/detail`),
      edit: (id: number) => path(ROOTS_PAGES, `/role/${id}/edit`),
    },
    permission: {
      root: path(ROOTS_PAGES, '/permission'),
      new: path(ROOTS_PAGES, '/permission/new'),
      list: path(ROOTS_PAGES, '/permission/list'),
      view: (id: number) => path(ROOTS_PAGES, `/permission/${id}/detail`),
      edit: (id: number) => path(ROOTS_PAGES, `/permission/${id}/edit`),
    },
    employee: {
      root: path(ROOTS_PAGES, '/employee'),
      new: path(ROOTS_PAGES, '/employee/new'),
      list: path(ROOTS_PAGES, '/employee/list'),
      view: (name: string) => path(ROOTS_PAGES, `/employee/${name}/detail`),
      edit: (name: string) => path(ROOTS_PAGES, `/employee/${name}/edit`),
    },
    department: {
      root: path(ROOTS_PAGES, '/department'),
      new: path(ROOTS_PAGES, '/department/new'),
      list: path(ROOTS_PAGES, '/department/list'),
      view: (name: string) => path(ROOTS_PAGES, `/department/${name}/detail`),
      edit: (name: string) => path(ROOTS_PAGES, `/department/${name}/edit`),
    },
    project: {
      root: path(ROOTS_PAGES, '/project'),
      new: path(ROOTS_PAGES, '/project/new'),
      list: path(ROOTS_PAGES, '/project/list'),
      view: (name: string) => path(ROOTS_PAGES, `/project/${name}/detail`),
      edit: (name: string) => path(ROOTS_PAGES, `/project/${name}/edit`),
    },
    payroll: {
      root: path(ROOTS_PAGES, '/payroll'),
      new: path(ROOTS_PAGES, '/payroll/new'),
      list: path(ROOTS_PAGES, '/payroll/list'),
      view: (name: string) => path(ROOTS_PAGES, `/payroll/${name}/detail`),
      edit: (name: string) => path(ROOTS_PAGES, `/payroll/${name}/edit`),
    },
  };
