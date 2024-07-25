import { PermissionCreateRequestDto } from './permission-create.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionUpdateRequestDto extends PermissionCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status!: number;
}