import { IsString, IsNumber, IsEmail, IsBoolean } from 'class-validator';
import { ICreateUserForm } from "../../types/users";
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements ICreateUserForm {
  @ApiProperty()
  @IsString()
  public fullname!: string ;

  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsString()
  public phone!: string;

  @ApiProperty()
  @IsString()
  public password!: string;

  @ApiProperty()
  @IsBoolean()
  public isSuperUser!: Boolean;

  @ApiProperty()
  @IsNumber()
  public authConfirmToken!: number;

  @ApiProperty()
  @IsNumber()
  public isVerified!: Boolean;

  @ApiProperty()
  @IsString()
  public username!: string;

  @ApiProperty()
  @IsString()
  public company!: string;

  @ApiProperty()
  @IsString()
  public avatarUrl!: string;

  @ApiProperty()
  @IsNumber()
  public status!: number;
}
