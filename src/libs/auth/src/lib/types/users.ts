/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RegisMethod {
    Email = "Email",
    Mobile = "Mobile",
    Facebook = "Facebook",
    Google = "Google",
    Apple = "Apple"
}

export enum IGrant {
    ADMIN = 0,
    USER = 1,
    CUSTOMER = 2,
}

export interface IRegisterUserForm {
    fullname: string;
    email: string;
    password: string;
    grant: IGrant;
    isVerrified: number
}
