import { IsString, IsNumber, ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";
import { ICreateRoleForm, IRoleStatus } from "../../types/roles";
import { ApiProperty } from '@nestjs/swagger';

export class RoleCreateRequestDto implements ICreateRoleForm {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roleName!: string ;

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  permissions!: number[];

  @ApiProperty()
  @IsNumber()
  status!: IRoleStatus;
}
