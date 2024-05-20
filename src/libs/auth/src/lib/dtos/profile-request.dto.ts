import { IAccessToken } from '../types';
import { IsString } from 'class-validator';

export class ProfileRequestDTO {
  @IsString()
  accessToken: string;
}
