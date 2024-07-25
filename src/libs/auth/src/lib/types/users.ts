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
    SUPERADMIN = 1,
    USER = 0,
}

export enum UserStatus {
    Active = 'active',
    Suspend = 'suspend',
    Disable = 'disable',
  }

export enum IStatus {
    Disable = 0,
    Active = 1,
    Suspend = 2,
}

export interface IRegisterUserForm {
    fullname: string;
    email: string;
    password: string;
    isSuperUser: Boolean;
    authConfirmToken: number;
    isVerified: Boolean;
}

export interface ICreateUserForm {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    isSuperUser: Boolean;
    authConfirmToken: number;
    isVerified: Boolean;
    username: string;
    company: string;
    avatarUrl: string;
    status: IStatus;
}

export interface IVerrifyConfirmForm {
    authConfirmToken: number;
}

export interface ILoginWithEmailForm {
    email: string;
    password: string;
}

export interface ILoginWithUsernameForm {
    username: string;
    password: string;
}
