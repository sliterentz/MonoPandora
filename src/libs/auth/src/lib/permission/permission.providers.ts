import { PermissionEntity as Permission } from "../entities";
import { PERMISSION_REPOSITORY } from '../types/constants';

export const permissionProviders = [
    {
        provide: PERMISSION_REPOSITORY,
        useValue: Permission,
    },
];