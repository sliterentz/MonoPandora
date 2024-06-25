export type IRoleGeneral = {
    id: string;
    roleName: string;
    status: number;
  };

export type IRoleState = {
    isLoading: boolean;
    error: Error | string | null;
    roles: IRoleGeneral[];
    role: IRoleGeneral | null;
  };