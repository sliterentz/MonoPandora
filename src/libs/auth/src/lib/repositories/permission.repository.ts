import { BaseRepository } from './base.repository';
import { PaginationRequest  } from '../interfaces';
import { DataSource } from 'typeorm';
import { PermissionEntity as Permission } from '../entities/permission.entity';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
// import { FastifyRequest } from 'fastify';
import { FastifyWithEntityManagerRequest } from '../interfaces/fastify-withentitymanager-request.interface';

@Injectable({ scope: Scope.REQUEST })
// @EntityRepository(PermissionEntity)
// export class PermissionRepository extends Repository<PermissionEntity> {
  export class PermissionRepository extends BaseRepository {
    constructor(
      dataSource: DataSource,
      @Inject(REQUEST) req: FastifyWithEntityManagerRequest,
      // @Inject(REQUEST) req: FastifyRequest,
      // private jwtService: JwtService,
      // @Inject(LoggerKey)
      // private logger: Logger
    ) {
        super(dataSource, req);
      }

  /**
   * Get permision list
   * @param pagination {PaginationRequest}
   * @returns permissionEntities[] and totalPermissions
   */
  public async getPermissionsAndCount(
    pagination: PaginationRequest,
  ): Promise<[permissionEntities: Permission[], totalPermissions: number]> {
    const {
      skip,
      limit: take,
      params: { search },
    } = pagination;
    const query = this.getRepository(Permission).createQueryBuilder('p').skip(skip).take(take).orderBy('p.createdAt');

    if (search) {
      query.where('p.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return query.getManyAndCount();
  }
}

export default PermissionRepository;
