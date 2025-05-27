import { ValidationPipe, ParseIntPipe, Controller, UseGuards, Param, Body, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { PermissionCreateRequestDto, PermissionUpdateRequestDto, PermissionResponseDto } from './dtos';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { SuperUserGuard } from '../guards/super-user.guard';
import { PermissionService } from './permission.service';
import { TOKEN_NAME } from '../types/constants';
import { ApiGlobalResponse } from '../decorators/api-global-response.decorator';
import { Permissions } from '../decorators/permissions.decorator';
import { ApiPaginatedResponse } from '../decorators/api-paginated-response.decorator';
import { PaginationParams } from '../decorators/pagination-param.decorator';
import { PaginationRequest } from '../interfaces/pagination-request.interface';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { JwtStrategy } from '../strategy/jwt.strategy'

@ApiTags('Permissions')
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: 'access',
  version: '1',
})
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get a paginated permission list' })
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
  @ApiPaginatedResponse(PermissionResponseDto)
  // @Permissions(
  //   'user.permissions.read',
  //   'user.permissions.create',
  //   'user.permissions.update',
  //   'user.roles.create',
  //   'user.roles.update',
  // )
  @Get('/permissions')
  public getPermissions(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<PermissionResponseDto>> {
    return this.permissionService.getPermissions(pagination);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get permission by id' })
  @ApiGlobalResponse(PermissionResponseDto)
  // @Permissions(
  //   'user.permissions.read',
  //   'user.permissions.create',
  //   'user.permissions.update',
  //   'user.roles.create',
  //   'user.roles.update',
  // )
  @Get('/permission/:id')
  public getPermissionById(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
    return this.permissionService.getPermissionById(id);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Create new permission' })
  @ApiGlobalResponse(PermissionResponseDto)
  @ApiConflictResponse({ description: 'Permission already exists' })
//   @UseGuards(SuperUserGuard)
  @Permissions('user.permissions.create')
  @Post('/permission/create')
  public createPermission(
    @Body(ValidationPipe) permissionDto: PermissionCreateRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.createPermission(permissionDto);
  }

  @UseGuards(JwtStrategy)
  @ApiOperation({ description: 'Update permission by id' })
  @ApiGlobalResponse(PermissionResponseDto)
  @ApiConflictResponse({ description: 'Permission already exists' })
  // @UseGuards(SuperUserGuard)
  @Permissions('user.permissions.update')
  @Put('/permission/:id')
  public updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) permissionDto: PermissionUpdateRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionService.updatePermission(id, permissionDto);
  }
}
