export interface AuthAccessResponseDto {
    additionalPermissions: string[];
    roles: {
      roleName: string;
      permissions: string[];
    }[];
  }
  