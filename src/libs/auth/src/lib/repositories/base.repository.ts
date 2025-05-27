import { FastifyWithEntityManagerRequest } from '../interfaces/fastify-withentitymanager-request.interface';
import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';;
import { ENTITY_MANAGER_KEY } from '../types/constants';

export class BaseRepository {
  constructor(private dataSource: DataSource, private request: FastifyWithEntityManagerRequest) {}

  protected getRepository<T extends ObjectLiteral>(entityCls: { new(): T }): Repository<T> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository<T>(entityCls);
  }
}
