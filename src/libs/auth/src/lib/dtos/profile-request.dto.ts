import { IAccessToken } from '../types';
import { IsJWT, IsString, IsNotEmpty } from 'class-validator';

export class ProfileRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;
}
