import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, isString } from 'class-validator';
import { types } from '@auth-lib';

export class RegisterUserForm implements types.user.IRegisterUserForm {
    @IsString()
    @MaxLength(20)
    fullname: string;

    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @MaxLength(50)
    password: string;

    @IsEnum(types.user.IGrant)
    grant: types.user.IGrant;
}
