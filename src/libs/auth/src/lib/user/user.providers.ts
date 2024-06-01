import AutoLoad from '@fastify/autoload';
import { UserEntity as User } from "../entities";
import { USER_REPOSITORY } from '../types/constants';

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];