import { IGrant } from '../types/users';

export type IRegisterRequestDTO = {
  fullname: string;
  email: string;
  password: string;
  grant: IGrant;
  authConfirmToken: number;
  isVerrified: number;
};
