import { ValidationPipe, ParseIntPipe, Controller, UseGuards, Param, Body, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleUpdateRequestDto, RoleCreateRequestDto, RoleResponseDto } from '@auth-lib';
import { RoleService } from './role.service';
import { TOKEN_NAME } from '../types/constants';
import { ApiGlobalResponse } from '../decorators/api-global-response.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator';
import { PaginationParams } from '../decorators/pagination-param.decorator';
import { PaginationRequest } from '../interfaces/pagination-request.interface';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
// import { Public } from '../decorators/public.decorator';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { JwtStrategy } from '../strategy/jwt.strategy'

@ApiTags('Roles')
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: 'access',
  version: '1',
})
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get a paginated role list' })
  @ApiPaginatedResponse(RoleResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
  // @Permissions('admin.access.roles.read', 'admin.access.roles.create', 'admin.access.roles.update')
  @Get('/roles')
  public getRoles(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.roleService.getRoles(pagination);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get role by id' })
  @ApiGlobalResponse(RoleResponseDto)
  // @Permissions('admin.access.roles.read', 'admin.access.roles.create', 'admin.access.roles.update')
  @Get('/role/:id')
  public getRoleById(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    return this.roleService.getRoleById(id);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Create new role' })
  @ApiGlobalResponse(RoleResponseDto)
  @ApiConflictResponse({ description: 'Role already exists' })
  // @Permissions('admin.access.roles.create')
  // @Public()
  @Post('/role/create')
  public createRole(@Body(ValidationPipe) roleDto: RoleCreateRequestDto): Promise<RoleResponseDto> {
    return this.roleService.createRole(roleDto);
  }

  @ApiOperation({ description: 'Update role by id' })
  @ApiGlobalResponse(RoleResponseDto)
  @ApiConflictResponse({ description: 'Role already exists' })
  @Permissions('admin.access.roles.update')
  @Put('/role/:id')
  public updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) roleDto: RoleUpdateRequestDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.updateRole(id, roleDto);
  }
}
