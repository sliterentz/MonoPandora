import { IsString, IsNumber, IsEmail } from "class-validator";
import { IGrant } from "../types/users";

export class UserModel {
  @IsEmail()
  email?: string;

  @IsString()
  fullname?: string;

  @IsString()
  password?: number;

  @IsNumber()
  grant?: IGrant;

  @IsNumber()
  authConfirmToken?: number;
}
