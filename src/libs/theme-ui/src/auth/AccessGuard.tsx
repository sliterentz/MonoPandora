export const AccessGuard = (requiredPermissions: string[], userPermissions: string[]): boolean => {
    return userPermissions.includes(requiredPermissions.toString());
  };