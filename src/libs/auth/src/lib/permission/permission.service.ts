import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable } from '@nestjs/common';
import { PermissionCreateRequestDto, PermissionUpdateRequestDto, PermissionResponseDto } from './dtos';
import { Pagination, PaginationResponseDto, PaginationRequest } from '@auth-lib';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionEntity as Permission } from '../entities/permission.entity';
import { Repository } from "typeorm";
import { PermissionExistsException } from '../helpers';
import { PermissionMapper } from './permission.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { DBErrorCode, DBError } from '../types';
import { TimeoutError } from 'rxjs';

@Injectable()
export class PermissionService {
  constructor(
    // @InjectRepository(PermissionRepository)
    // private permissionRepository: PermissionRepository,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private permissionsRepository: PermissionRepository,
  ) {}

  /**
   * Get a paginated permission list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<PermissionResponseDto>>}
   */
  public async getPermissions(pagination: PaginationRequest): Promise<PaginationResponseDto<PermissionResponseDto>> {
    try {
      const [permissionEntities, totalPermissions] = await this.permissionsRepository.getPermissionsAndCount(pagination);

      const permissionDtos = await Promise.all(permissionEntities.map(PermissionMapper.toDto));

      return Pagination.of(pagination, totalPermissions, permissionDtos);
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
   * Get permission by id
   * @param id {number}
   * @returns {Promise<PermissionResponseDto>}
   */
  public async getPermissionById(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({
        where: { id }
    });
    if (!permission) {
      throw new NotFoundException();
    }

    return PermissionMapper.toDto(permission);
  }

  /**
   * Create new permission
   * @param permissionDto {PermissionCreateRequestDto}
   * @returns {Promise<PermissionResponseDto>}
   */
  public async createPermission(permissionDto: PermissionCreateRequestDto): Promise<any> {
    try {
      let permission = PermissionMapper.toCreateEntity(permissionDto);
      const newPermission = this.permissionRepository.create(permission);
      permission = await this.permissionRepository.save(newPermission);
      return PermissionMapper.toDto(permission);
    } catch (error) {
        const dbError = error as DBError;
      if (dbError.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new PermissionExistsException(permissionDto.permissionName);
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        console.log(error)
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Update permission by id
   * @param id {number}
   * @param permissionDto {PermissionUpdateRequestDto}
   * @returns {Promise<PermissionResponseDto>}
   */
  public async updatePermission(id: number, permissionDto: PermissionUpdateRequestDto): Promise<PermissionResponseDto> {
    let permission = await this.permissionRepository.findOne({
        where: { id }
    });
    if (!permission) {
      throw new NotFoundException();
    }

    try {
      permission = PermissionMapper.toUpdateEntity(permission, permissionDto);
      permission = await this.permissionRepository.save(permission);
      return PermissionMapper.toDto(permission);
    } catch (error) {
        const dbError = error as DBError;
      if (dbError.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new PermissionExistsException(permissionDto.permissionName);
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
