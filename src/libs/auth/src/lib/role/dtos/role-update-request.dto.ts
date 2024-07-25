import { RoleCreateRequestDto } from './role-create-request.dto';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleUpdateRequestDto extends RoleCreateRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    roleNameEdit!: string ;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    statusEdit!: number;
}