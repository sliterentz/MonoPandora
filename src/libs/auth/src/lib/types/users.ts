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
    SUPERADMIN = 0,
    SUPERVISOR = 1,
    EMPLOYEE = 2,
    CLIENT = 3,
}

export interface IRegisterUserForm {
    fullname: string;
    email: string;
    password: string;
    grant: IGrant;
    authConfirmToken: number;
    isVerrified: number;
}

export interface IVerrifyConfirmForm {
    authConfirmToken: number;
}

export interface ILoginForm {
    email: string;
    password: string;
}