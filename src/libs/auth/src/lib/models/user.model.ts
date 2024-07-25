import { IsString, IsNumber, IsEmail, IsBoolean } from 'class-validator';
import { ICreateUserForm, IStatus } from "../types/users";

export class UserModel implements ICreateUserForm {
  @IsString()
  fullname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  password!: string;

  @IsBoolean()
  isSuperUser!: Boolean;

  @IsNumber()
  authConfirmToken!: number;

  @IsBoolean()
  isVerified!: Boolean;

  @IsString()
  username!: string;

  @IsString()
  company!: string;

  @IsString()
  avatarUrl!: string;

  @IsNumber()
  status!: IStatus;
}
