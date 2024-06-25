import { IUserAccountGeneral } from "../lib/types";

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
  };
  
  // ----------------------------------------------------------------------
  
  export type JWTContextType = {
    method: string;
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: AuthUserType;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullname: string, grant: number, isVerified: boolean, status: number) => Promise<void>;
    verify: (code1: string, code2: string, code3: string, code4: string, code5: string, code6: string) => Promise<void>;
    createUser: (username: string, email: string, phone: string, password: string, fullname: string, grant: number, isVerified: boolean, company: string, avatarUrl: string, status: number) => Promise<IUserAccountGeneral>;
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
