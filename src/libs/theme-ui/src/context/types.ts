import { IUserAccountGeneral, IRoleGeneral, IPermissionGeneral, IResponse } from "../lib/types";

  export type ActionMapType<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
      ? {
        type: Key;
      }
      : {
        type: Key;
        payload: M[Key];
      };
  };

  export type AuthUserType = null | Record<string, any>;

  export type AuthStateType = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    role?: AuthRoleType;
    permission?: AuthPermissionType;
  };

  export type AuthRoleType = null | Record<string, any>;

  export type AuthPermissionType = null | Record<string, any>;

  // ----------------------------------------------------------------------

  export type JWTContextType = {
    method: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    role: AuthRoleType;
    login: (email: string, password: string) => Promise<void>;
    register: (fullname: string, email: string, phone: string, username: string, password: string, isSuperUser: false, isVerified: false, company: '', avatarUrl: '', roles: [4], status: 1) => Promise<IResponse>;
    verify: (code1: string, code2: string, code3: string, code4: string, code5: string, code6: string) => Promise<void>;
    createUser: (username: string, password: string, email: string, phone: string, fullname: string, isSuperUser: boolean, isVerified: boolean, company: string, avatarUrl: string, roles: number[], status: number) => Promise<IUserAccountGeneral>;
    updateUser: (id: string, fullname: string, email: string, phone: string, username: string, isSuperUser: boolean, isVerified: boolean, company: string, avatarUrl: string, roles: number[], status: number) => Promise<IUserAccountGeneral>;
    createRole: (roleName: string, permissions: number[], status: number) => Promise<IRoleGeneral>;
    updateRole: (id: number, roleName: string, permissions: number[], status: number) => Promise<IRoleGeneral>;
    createPermission: (permissionName: string, description: string, status: number) => Promise<IPermissionGeneral>;
    updatePermission: (id: number, permissionName: string, description: string, status: number) => Promise<IPermissionGeneral>;
    changePassword: (id: number, currentPassword: string, newPassword: string) => Promise<IUserAccountGeneral>;
    profile: (token: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle?: () => void;
    loginWithGithub?: () => void;
    loginWithTwitter?: () => void;
  };

  export type FirebaseContextType = {
    method: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    login: (email: string, password: string) => void;
    register: (email: string, password: string, firstName: string, lastName: string) => void;
    logout: () => void;
    loginWithGoogle?: () => void;
    loginWithGithub?: () => void;
    loginWithTwitter?: () => void;
  };

  export type AWSCognitoContextType = {
    method: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    login: (email: string, password: string) => void;
    register: (email: string, password: string, firstName: string, lastName: string) => void;
    logout: () => void;
    loginWithGoogle?: () => void;
    loginWithGithub?: () => void;
    loginWithTwitter?: () => void;
  };

  export type Auth0ContextType = {
    method: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    // login: () => Promise<void>;
    logout: () => void;
    // To avoid conflicts between types this is just a temporary declaration.
    // Remove below when you choose to authenticate with Auth0.
    login: (email?: string, password?: string) => Promise<void>;
    register?: (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => Promise<void>;
    loginWithGoogle?: () => void;
    loginWithGithub?: () => void;
    loginWithTwitter?: () => void;
  };
