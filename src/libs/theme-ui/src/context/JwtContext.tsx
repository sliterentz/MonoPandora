import { createContext, useEffect, useReducer, useCallback, useMemo, ReactNode } from 'react';
// utils
import axios from '../lib/utils/axios';
import localStorageAvailable from '../lib/utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
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

        // const response = await axios.get('/api/v1/auth/profile');

        // const { user } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: null,
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
    const { accessToken, user } = response.data.data;

    setSession(accessToken);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user[0]));

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, fullname: string, grant: number, isVerrified: boolean) => {
      try {
      const response = await axios.post('/api/v1/auth/signup', {
        email,
        password,
        fullname,
        grant,
        isVerrified
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

      const { user } = response.data;

      localStorage.setItem('user', user);

      dispatch({
        type: Types.PROFILE,
        payload: {
          isAuthenticated: true,
          user,
        },
      });
    } catch(err) {
      console.log(err)
    }
    },
    []
  )

  // CREATE USER
  const createUser = useCallback(
      async (username: string, password: string, email: string, fullname: string, phone: string, grant: number, isVerrified: boolean) => {
        try {
        const response = await axios.post('/api/v1/user/add', {
          username,
          password,
          email,
          fullname,
          phone,
          grant,
          isVerrified
        });

        const { accessToken, user } = response.data;
  
        // localStorage.setItem('accessToken', accessToken);
  
        // dispatch({
        //   type: Types.REGISTER,
        //   payload: {
        //     user,
        //   },
        // });
      } catch(err) {
        console.log(err)
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
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, verify, profile]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
