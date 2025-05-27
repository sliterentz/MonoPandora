import { IsNotEmpty, IsString } from 'class-validator';
import { ILoginWithEmailForm } from '../types';

export class LoginWithEmailRequestDTO implements ILoginWithEmailForm {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
};
