import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permission/dtos';
import { RoleResponseDto } from '../../role/dtos';

export class UserResponseDto {
  @ApiProperty()
   id!: string;

  @ApiProperty()
   fullname!: string ;

  @ApiProperty()
   email!: string;

  @ApiProperty()
   phone!: string;

  // @ApiProperty()
  //  password!: string;

  @ApiProperty()
   isSuperUser!: Boolean;

  // @ApiProperty()
  //  authConfirmToken!: number;

  @ApiProperty()
   isVerified!: Boolean;

  @ApiProperty()
   username!: string;

  @ApiProperty()
   company!: string;

  @ApiProperty()
   avatarUrl!: string;

  @ApiProperty()
   roleIds?: number[];

  @ApiProperty({ type: [RoleResponseDto] })
   roles?: RoleResponseDto[];

  @ApiProperty({ type: [PermissionResponseDto] })
   permissions?: PermissionResponseDto[];

  @ApiProperty()
  status!: number;

}
