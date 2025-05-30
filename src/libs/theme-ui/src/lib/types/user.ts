export type IUserAccountGeneral = {
    id: string;
    username: string;
    password: string;
    fullname: string;
    email: string;
    phone: string;
    status: number;
    isSuperUser: boolean;
    isVerified: boolean;
    company: string;
    avatarUrl: string;
    roleIds: number[];
    roles: number[];
  };

  export interface IResponse {
    code: number;
    message: string;
    data: IUserAccountGeneral;
  }

export type IUserCompanyList = {
  id: string,
  companyName: string,
}

export type IUserAuth = {
  isLoading: boolean,
  userInfo: [],
  userToken: string | null,
  error: [],
  success: boolean,
}

export type IUserState = {
  currentUser: IUserAccountGeneral | null;
  isLoading: boolean;
  error: Error | string | null;
  users: IUserAccountGeneral[];
  user: IUserAccountGeneral | null;
};
