import { IsJWT, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
