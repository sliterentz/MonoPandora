import { IsNotEmpty, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const permissionNameRegex = /^[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*$/;
export class PermissionCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(permissionNameRegex)
  @MaxLength(60)
  permissionName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 160)
  description!: string;
}