import { BaseRepository } from './base.repository';
import { PaginationRequest } from '../interfaces';
import { DataSource } from 'typeorm';
import { RoleEntity as Role } from '../entities/role.entity';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
// import { FastifyRequest } from 'fastify';
import { FastifyWithEntityManagerRequest } from '../interfaces/fastify-withentitymanager-request.interface';

@Injectable({ scope: Scope.REQUEST })
// export class RoleRepository extends Repository<Role> {
  export class RoleRepository extends BaseRepository {
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
   * Get roles list
   * @param pagination {PaginationRequest}
   * @returns [roleEntities: Role[], totalRoles: number]
   */
  public async getRolesAndCount(
    pagination: PaginationRequest,
  ): Promise<[roleEntities: Role[], totalRoles: number]> {
    const {
      skip,
      limit: take,
      params: { search },
    } = pagination;
    const query = this.getRepository(Role).createQueryBuilder('r')
      .innerJoinAndSelect('r.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy('r.createdAt');

    if (search) {
      query.where('r.roleName ILIKE :search', { search: `%${search}%` });
    }

    return query.getManyAndCount();
  }
}

export default RoleRepository;
