import {IsEmail, IsString, IsEnum, IsNumber} from 'class-validator';
import { types } from '@auth-lib';

export class AuthModel implements types.user.IRegisterUserForm {
  @IsString()
  fullname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(types.user.IGrant)
  grant!: types.user.IGrant;

  @IsNumber()
  isVerrified!: number;
}
