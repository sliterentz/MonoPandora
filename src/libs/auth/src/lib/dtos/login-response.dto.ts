// import { IAccessToken } from '../types';

// export type LoginResponseDTO = IAccessToken;

import { UserResponseDto } from '../user/dtos';
import { AuthAccessResponseDto } from './auth-access-response.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDTO {
  token!: TokenDto;
  user!: UserResponseDto;
  access!: AuthAccessResponseDto;
}
