import { createContext, useEffect, useReducer, useCallback, useMemo, ReactNode } from 'react';
// utils
import axios from '../lib/utils/axios';
import localStorageAvailable from '../lib/utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, AuthRoleType, AuthPermissionType, JWTContextType } from './types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  CREATEUSER = 'CREATEUSER',
  UPDATEUSER = 'UPDATEUSER',
  CREATEROLE = 'CREATEROLE',
  UPDATEROLE = 'UPDATEROLE',
  CREATEPERMISSION = 'CREATEPERMISSION',
  UPDATEPERMISSION = 'UPDATEPERMISSION',
  VERIFY = 'VERIFY',
  PROFILE = 'PROFILE',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.CREATEUSER]: {
    user: AuthUserType;
  };
  [Types.UPDATEUSER]: {
    user: AuthUserType;
  };
  [Types.CREATEROLE]: {
    role: AuthRoleType;
  };
  [Types.UPDATEROLE]: {
    role: AuthRoleType;
  };
  [Types.CREATEPERMISSION]: {
    permission: AuthPermissionType;
  };
  [Types.UPDATEPERMISSION]: {
    permission: AuthPermissionType;
  };
  [Types.PROFILE]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.VERIFY]: undefined;
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.CREATEUSER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.UPDATEUSER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.CREATEROLE) {
    return {
      ...state,
      isAuthenticated: true,
      role: action.payload.role,
    };
  }
  if (action.type === Types.UPDATEROLE) {
    return {
      ...state,
      isAuthenticated: true,
      role: action.payload.role,
    };
  }
  if (action.type === Types.CREATEPERMISSION) {
    return {
      ...state,
      isAuthenticated: true,
      permission: action.payload.permission,
    };
  }
  if (action.type === Types.UPDATEPERMISSION) {
    return {
      ...state,
      isAuthenticated: true,
      permission: action.payload.permission,
    };
  }
  if (action.type === Types.VERIFY) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  if (action.type === Types.PROFILE) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

export const getToken = () => {
  return localStorage.getItem('accessToken');
}

export const removeToken = () => {
  localStorage.removeItem('accessToken');
}

export const setToken = (val) => {
  localStorage.setItem('accessToken', val);
}

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken) {
        setSession(accessToken);

        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        const response = await axios.get('/api/v1/auth/profile');

        const { user } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/api/v1/auth/signin', {
      email,
      password,
    })

    if (response) {
    const { user } = response.data.data;
    const { accessToken } = response.data.data.token;
    const { roleName } = response.data.data.access.roles[0];

    setSession(accessToken);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', JSON.stringify(roleName));

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: null,
      },
    });
  }
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, fullname: string, isSuperUser: boolean, isVerified: boolean, status: number) => {
      try {
      const response = await axios.post('/api/v1/auth/signup', {
        email,
        password,
        fullname,
        isSuperUser,
        isVerified,
        status,
      });
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    } catch(err) {
      console.log(err)
    }
    },
    []
  );

  // VERIFY
  const verify = useCallback(
    async (code1: string, code2: string, code3: string, code4: string, code5: string, code6: string) => {
      try {
      const authConfirmToken = code1+code2+code3+code4+code5+code6;
      const response = await axios.post('/api/v1/auth/verify', {
        authConfirmToken,
      });
      const { result } = response.data;

      // localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.VERIFY,
      });
    } catch(err) {
      console.log(err)
    }
    },
    []
  );

  // PROFILE
  const profile = useCallback(
    async (token: string) => {
      try {

        localStorage.setItem('accessToken', token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      //   const headers = {
      //   'Authorization': 'Bearer '+token,
      // };

      const response = await axios.get('/api/v1/auth/profile');

      if (response.status === 200) {
        const { user } = response.data;
        localStorage.setItem('user', user);

        dispatch({
          type: Types.PROFILE,
          payload: {
          isAuthenticated: true,
          user,
        },
      });
    }

    } catch(err) {
      console.log(err)
    }
    },
    []
  )

  // CREATE USER
  const createUser = useCallback(
      async (username: string, password: string, email: string, phone: string, fullname: string, isSuperUser: boolean, isVerified: boolean, company: string, avatarUrl: string, status: number) => {
        try {
        const response = await axios.post('/api/v1/auth/user/create', {
          username,
          password,
          email,
          phone,
          fullname,
          isSuperUser,
          isVerified,
          company,
          avatarUrl,
          status,
        });

        const { user } = response.data;

        // localStorage.setItem('accessToken', accessToken);

        dispatch({
          type: Types.CREATEUSER,
          payload: {
            user,
          },
        });
      } catch(err) {
        console.log(err)
      }
      },
      []
  );

  // EDIT USER
  const updateUser = useCallback(
    async (id: string, 
      fullname: string,
      email: string,
      phone: string,
      username: string,
      isSuperUser: boolean,
      isVerified: boolean,
      company: string,
      avatarUrl: string,
      roleIds: number[],
      status: number
    ) => {
      try {
        // const token = localStorage.getItem('accessToken');
        // const headers = {
        //   'Authorization': 'Bearer '+ token,
        // }
        // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const roles = roleIds;

        const response = await axios.put(`/api/v1/auth/user/${id}`, { fullname, email, phone, username, isSuperUser, isVerified, company, avatarUrl, roleIds, roles, status });

        const { user } = response.data;

        dispatch({
          type: Types.UPDATEUSER,
          payload: {
            user,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  // CREATE ROLE
  const createRole = useCallback(
      async (roleName: string, permissions: number[], status: number) => {
        try {
        const response = await axios.post('/api/v1/access/role/create', {
          roleName,
          permissions,
          status,
        });

        const { role } = response.data;

        // localStorage.setItem('accessToken', accessToken);

        dispatch({
          type: Types.CREATEROLE,
          payload: {
            role,
          },
        });
      } catch(err) {
        console.log(err)
      }
      },
      []
  );

  // EDIT ROLE
  const updateRole = useCallback(
    async (id: string, 
      roleName: string,
      permissionIds: number[],
      status: number
    ) => {
      try {
        // const token = localStorage.getItem('accessToken');
        // const headers = {
        //   'Authorization': 'Bearer '+ token,
        // }
        // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const permissions = permissionIds;

        const response = await axios.put(`/api/v1/access/role/${id}`, { roleName, permissions, status });

        const { role } = response.data;

        dispatch({
          type: Types.UPDATEROLE,
          payload: {
            role,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

    // CREATE PERMISSION
    const createPermission = useCallback(
      async (permissionName: string, description: string, status: number) => {
        try {
        const response = await axios.post('/api/v1/access/permission/create', {
          permissionName,
          description,
          status,
        });

        const { role } = response.data;

        // localStorage.setItem('accessToken', accessToken);

        dispatch({
          type: Types.CREATEROLE,
          payload: {
            role,
          },
        });
      } catch(err) {
        console.log(err)
      }
      },
      []
  );

  // EDIT PERMISSION
  const updatePermission = useCallback(
    async (id: string, 
      permissionName: string,
      description: string,
      status: number
    ) => {
      try {
        // const token = localStorage.getItem('accessToken');
        // const headers = {
        //   'Authorization': 'Bearer '+ token,
        // }
        // axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await axios.put(`/api/v1/access/permission/${id}`, { permissionName, description, status });

        const { role } = response.data;

        dispatch({
          type: Types.UPDATEROLE,
          payload: {
            role,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      verify,
      profile,
      createUser,
      updateUser,
      createRole,
      updateRole,
      createPermission,
      updatePermission,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, verify, profile, createUser, updateUser, createRole, updateRole, createPermission, updatePermission]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
