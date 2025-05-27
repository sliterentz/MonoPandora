import { IGrant } from '../types/users';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsStrongPassword,
  IsNumber,
  IsEnum,
  IsBoolean
} from 'class-validator';

export class EditUserRequestDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  fullname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

  @IsBoolean()
  isSuperUser!: Boolean;

  @IsNumber()
  authConfirmToken!: number;

  @IsBoolean()
  isVerified!: Boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  company!: string;

  @IsString()
  avatarUrl!: string;

  @IsNotEmpty()
  @IsNumber()
  status!: number;
};
