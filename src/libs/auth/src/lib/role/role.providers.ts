import { RoleEntity as Role } from "../entities";
import { ROLE_REPOSITORY } from '../types/constants';

export const roleProviders = [
    {
        provide: ROLE_REPOSITORY,
        useValue: Role,
    },
];