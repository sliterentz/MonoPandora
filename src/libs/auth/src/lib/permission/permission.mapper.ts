import { PermissionEntity } from '../entities/permission.entity';
import { PermissionCreateRequestDto, PermissionUpdateRequestDto, PermissionResponseDto } from './dtos';

export class PermissionMapper {
  public static toDto(entity: PermissionEntity): PermissionResponseDto {
    const dto = new PermissionResponseDto();
    dto.id = entity.id;
    dto.permissionName = entity.permissionName;
    dto.description = entity.description;
    dto.status = entity.status;
    return dto;
  }

  public static toCreateEntity(dto: PermissionCreateRequestDto): PermissionEntity {
    const entity = new PermissionEntity();
    entity.permissionName = dto.permissionName;
    entity.description = dto.description;
    entity.status = 1;
    return entity;
  }

  public static toUpdateEntity(entity: PermissionEntity, dto: PermissionUpdateRequestDto): PermissionEntity {
    entity.permissionName = dto.permissionName;
    entity.description = dto.description;
    entity.status = dto.status;
    return entity;
  }
}