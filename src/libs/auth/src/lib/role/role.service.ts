import { Injectable, InternalServerErrorException, RequestTimeoutException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { RoleEntity as Role } from '../entities';
import { RoleRepository } from '../repositories';

import { Pagination, PaginationRequest, PaginationResponseDto } from '@auth-lib';
import { RoleCreateRequestDto, RoleUpdateRequestDto, RoleResponseDto } from './dtos';
import { ForeignKeyConflictException, RoleExistsException } from '../helpers';
import { DBErrorCode, DBError } from '../types';
import { RoleMapper } from './role.mapper';
import { TimeoutError } from 'rxjs';

@Injectable()
export class RoleService {
    constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private rolesRepository: RoleRepository,
) { }

  /**
   * Get role by id
   * @param id {number}
   * @returns {Promise<RoleResponseDto>}
   */
    public async getRoleById(id: number): Promise<RoleResponseDto> {
      const roleEntity = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });
      if (!roleEntity) {
        throw new NotFoundException();
      }

      const roleDto = await RoleMapper.toDto(roleEntity);
      const { permissions = [] } = await RoleMapper.toDtoWithRelations(roleEntity);
      const mappedPermissions = permissions.map(({ id }) => ({ id }));

      // return RoleMapper.toDtoWithRelations(roleEntity);

      return {
        id: roleDto.id,
        roleName: roleDto.roleName,
        permissionIds: mappedPermissions.map(permission => permission.id as number),
        permissions,
        status: roleDto.status,
      }
    }

  /**
   * Create new role
   * @param roleDto {RoleCreateRequestDto}
   * @returns {Promise<RoleResponseDto>}
   */
  public async createRole(roleDto: RoleCreateRequestDto): Promise<RoleResponseDto> {
    try {
      let roleEntity = RoleMapper.toCreateEntity(roleDto);
      console.log(roleEntity)
      const newRole = this.roleRepository.create(roleEntity);
      roleEntity = await this.roleRepository.save(newRole);
      return RoleMapper.toDto(roleEntity);
    } catch (error) {
      const dbError = error as DBError;
      if (dbError.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new RoleExistsException(roleDto.roleName);
      }
      if (
        dbError.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        dbError.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(pageOptionsDto: PaginationRequest): Promise<any> {
    return await this.rolesRepository.getRolesAndCount(pageOptionsDto);
  }

  /**
   * Get a paginated role list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<RoleResponseDto>>}
   */
    public async getRoles(pagination: PaginationRequest): Promise<PaginationResponseDto<RoleResponseDto>> {
      try {
        const [roleEntities, totalRoles] = await this.rolesRepository.getRolesAndCount(pagination);

        const roleDtos = await Promise.all(roleEntities.map(RoleMapper.toDtoWithRelations));
        return Pagination.of(pagination, totalRoles, roleDtos);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException();
        }
        if (error instanceof TimeoutError) {
          throw new RequestTimeoutException();
        } else {
          throw new InternalServerErrorException();
        }
      }
    }

  /**
   * Update role by id
   * @param id {number}
   * @param roleDto {RoleUpdateRequestDto}
   * @returns {Promise<RoleResponseDto>}
   */
  public async updateRole(id: number, roleDto: RoleUpdateRequestDto): Promise<RoleResponseDto> {
    let roleEntity = await this.roleRepository.findOne({
      where: { id }
    });
    if (!roleEntity) {
      throw new NotFoundException();
    }

    try {
      roleEntity = RoleMapper.toUpdateEntity(roleEntity, roleDto);
      roleEntity = await this.roleRepository.save(roleEntity);
      return RoleMapper.toDto(roleEntity);
    } catch (error) {
      const dbError = error as DBError;
      if (dbError.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new RoleExistsException(roleDto.roleName);
      }
      if (
        dbError.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        dbError.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  // async getRoles(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoleCreateRequestDto>> {
  //   const queryBuilder = this.roleRepository.createQueryBuilder('role');

  //   queryBuilder
  //     .orderBy('role.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take);

  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();

  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  //   return new PageDto(entities, pageMetaDto);
  // }

}
