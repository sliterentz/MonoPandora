import { IsEmail, IsString, IsNumber, IsBoolean } from 'class-validator';
import { IRegisterUserForm } from '../types';

export class AuthModel implements IRegisterUserForm {
  @IsString()
  fullname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsBoolean()
  isSuperUser!: Boolean;

  @IsNumber()
  authConfirmToken!: number;

  @IsBoolean()
  isVerified!: Boolean;
}
