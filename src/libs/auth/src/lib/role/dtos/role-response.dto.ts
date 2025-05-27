import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dtos';

export class RoleResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  roleName!: string;

  @ApiProperty()
  permissionIds?: number[];

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions?: PermissionResponseDto[];

  @ApiProperty()
  status!: number;
}