import AutoLoad from '@fastify/autoload';
import { User } from "../src/entities";
import { USER_REPOSITORY } from '@auth-lib';

export const usersProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];
