export type IPermissionGeneral = {
    id: number;
    permissionName: string;
    description: string;
    status: number;
  };

export type IPermissionState = {
    currentPermission: IPermissionGeneral | null;
    isLoading: boolean;
    error: Error | string | null;
    permissions: IPermissionGeneral[];
    permission: IPermissionGeneral | null;
  };