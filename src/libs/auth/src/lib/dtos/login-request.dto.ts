import { IsNotEmpty, IsString } from 'class-validator';
import { ILoginForm } from '../types';

export class LoginRequestDTO implements ILoginForm {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
};
