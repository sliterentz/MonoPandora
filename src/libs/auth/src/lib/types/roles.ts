export enum IGrant {
   SUPERADMIN = 0,
   SUPERVISOR = 1,
   EMPLOYEE = 2,
   CLIENT = 3,
}

export enum IRoleStatus {
   Disable = 0,
   Active = 1,
}

export interface ICreateRoleForm {
   roleName: string;
   permissions: number[];
   status: IRoleStatus;
}