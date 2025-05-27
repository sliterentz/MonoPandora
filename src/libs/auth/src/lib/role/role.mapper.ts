import { PermissionEntity } from '../entities/permission.entity';
import { PermissionMapper } from '../permission/permission.mapper';
import { RoleCreateRequestDto, RoleUpdateRequestDto, RoleResponseDto } from './dtos';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
    const dto = new RoleResponseDto();
    dto.id = entity.id;
    dto.roleName = entity.roleName;
    dto.status = entity.status;
    return dto;
  }

  public static async toDtoWithRelations(entity: RoleEntity): Promise<RoleResponseDto> {
    const dto = new RoleResponseDto();
    dto.id = entity.id;
    dto.roleName = entity.roleName;
    dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
    dto.status = entity.status;
    return dto;
  }

  public static toCreateEntity(dto: RoleCreateRequestDto): RoleEntity {
    const entity = new RoleEntity();
    entity.roleName = dto.roleName;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.status = 1;
    return entity;
  }

  public static toUpdateEntity(entity: RoleEntity, dto: RoleUpdateRequestDto): RoleEntity {
    entity.roleName = dto.roleName;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.status = dto.status;
    return entity;
  }
}