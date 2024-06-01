import {IsEmail, IsString, IsEnum, IsNumber} from 'class-validator';
import { IRegisterUserForm, IGrant } from '../types';

export class AuthModel implements IRegisterUserForm {
  @IsString()
  fullname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(IGrant)
  grant!: IGrant;

  @IsNumber()
  authConfirmToken!: number;

  @IsNumber()
  isVerrified!: number;
}
