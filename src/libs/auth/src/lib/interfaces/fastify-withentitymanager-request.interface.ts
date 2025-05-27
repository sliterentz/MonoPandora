import { FastifyRequest } from 'fastify';
import { EntityManager } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../types/constants';

export interface FastifyWithEntityManagerRequest extends FastifyRequest {
  // [key: string]: any; // Allow for arbitrary properties
  [ENTITY_MANAGER_KEY]?: EntityManager; // Define your custom property
  // [ENTITY_MANAGER_KEY]?: EntityManager;
}

