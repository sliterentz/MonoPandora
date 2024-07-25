import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserCreateRequestDto, UserUpdateRequestDto, UserResponseDto } from './dtos';
import { RoleMapper } from '../role/role.mapper';
import { PermissionMapper } from '../permission/permission.mapper';

export class UserMapper {
  public static toDto(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.fullname = entity.fullname;
    dto.email = entity.email;
    dto.phone = entity.phone;
    // dto.password = entity.password;
    dto.isSuperUser = entity.isSuperUser;
    dto.isVerified = entity.isVerified;
    dto.username = entity.username;
    dto.company = entity.company;
    dto.avatarUrl = entity.avatarUrl;
    dto.status = entity.status;
    return dto;
  }

  public static async toDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.fullname = entity.fullname;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.permissions = entity.permissions ? await Promise.all((await entity.permissions).map(PermissionMapper.toDto)) : [];
    dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDtoWithRelations));
    dto.isSuperUser = entity.isSuperUser;
    dto.status = entity.status;
    return dto;
  }

  public static toCreateEntity(dto: UserCreateRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.fullname = dto.fullname;
    entity.email = dto.email;
    entity.phone = dto.phone;
    entity.password = dto.password;
    entity.isSuperUser = dto.isSuperUser;
    entity.isVerified = dto.isVerified;
    entity.username = dto.username;
    entity.company = dto.company;
    entity.avatarUrl = dto.avatarUrl;
    entity.roles = Promise.resolve(dto.roles?.map((id) => new RoleEntity({ id })) || []);
    entity.status = 1;
    return entity;
  }

  public static toUpdateEntity(entity: UserEntity, dto: UserUpdateRequestDto): UserEntity {
    entity.fullname = dto.fullname;
    entity.email = dto.email;
    entity.phone = dto.phone;
    // entity.password = dto.password;
    entity.isSuperUser = dto.isSuperUser;
    entity.isVerified = dto.isVerified;
    entity.username = dto.username;
    entity.company = dto.company;
    entity.avatarUrl = dto.avatarUrl;
    entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
    entity.status = dto.status;
    return entity;
  }
}
