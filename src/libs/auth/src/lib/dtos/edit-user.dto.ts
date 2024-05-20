import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength, isString } from 'class-validator';
import { user } from '../types';

export class EditUserDTO implements user.IRegisterUserForm {
    @IsString()
    @MaxLength(20)
    fullname: string;

    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @MaxLength(50)
    password: string;

    @IsEnum(user.IGrant)
    grant: user.IGrant;

    @IsNumber()
    authConfirmToken: number;

    @IsNumber()
    isVerrified: number;
}
