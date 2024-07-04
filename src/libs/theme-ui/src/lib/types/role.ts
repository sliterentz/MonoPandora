export type IRoleGeneral = {
    id: number;
    roleName: string;
    permissionIds: number[];
    pemissions: number[];
    status: number;
  };

  interface RoleState {
    currentRole: IRoleGeneral | null;
    loading: boolean;
    error: Error | null;
  }

export type IRoleState = {
    currentRole: IRoleGeneral | null;
    isLoading: boolean;
    error: Error | string | null;
    roles: IRoleGeneral[];
    role: IRoleGeneral | null;
  };