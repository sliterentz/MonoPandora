import { IsString, IsNumber, IsEmail } from "class-validator";
import { IGrant } from "../types/users";

export class UserModel {
  @IsEmail()
  email?: string;

  @IsString()
  fullname?: string;

  @IsString()
  password?: string;

  @IsNumber()
  grant?: IGrant;
}