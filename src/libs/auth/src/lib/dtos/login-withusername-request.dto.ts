import { IsNotEmpty, IsString } from 'class-validator';
import { ILoginWithUsernameForm } from '../types';

export class LoginWithUsernameRequestDTO implements ILoginWithUsernameForm {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
};
