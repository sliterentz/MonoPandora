// import { IGrant } from '../types/users';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsStrongPassword,
  IsNumber,
  IsBoolean
} from 'class-validator';

export class RegisterRequestDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  fullname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

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
}
