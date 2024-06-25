export type IPermissionGeneral = {
    id: string;
    permissionName: string;
    status: number;
  };

export type IPermissionState = {
    isLoading: boolean;
    error: Error | string | null;
    permissions: IPermissionGeneral[];
    permission: IPermissionGeneral | null;
  };