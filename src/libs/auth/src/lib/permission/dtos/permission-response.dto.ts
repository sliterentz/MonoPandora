import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  permissionName!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  status!: number;
}