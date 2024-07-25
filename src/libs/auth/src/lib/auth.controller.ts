import { ValidationPipe, Param, ParseUUIDPipe, Body, Controller, Get, Post, Put, Res, Request, UseGuards, UseInterceptors } from '@nestjs/common';

import { AuthService } from "./auth.service";
import { UserService } from "./user/user.service";
// import { JwtService } from '@nestjs/jwt';
// import { UserEntity as User } from "./entities";
import { IAuthConfirmToken } from "./types";
import { Public } from './decorators/public.decorator';
import { JwtStrategy } from './strategy/jwt.strategy'
// import { GetUser } from './decorators/user.decorator'
// import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
// import { RefreshTokenDTO } from './dtos/refresh-token.dto';
// import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ApiOperation, ApiConflictResponse, ApiQuery } from '@nestjs/swagger';
// import { PageOptionsDto } from '@auth-lib';
import { LoginWithEmailRequestDTO } from './dtos/login-withemail-request.dto';
import { UserCreateRequestDto, UserUpdateRequestDto, UserChangePasswordRequestDto, UserResponseDto } from './user/dtos';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { ApiGlobalResponse, ApiPaginatedResponse, PaginationParams } from './decorators';
import { PaginationResponseDto } from './dtos/pagination-response.dto';
import { PaginationRequest } from './interfaces';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  // private logger = new Logger('AuthController');
  constructor(private authService: AuthService, private userService: UserService) {}

  @UseInterceptors(ResponseInterceptor)
  @Public()
  @Post('/signup')
  async signup(@Body(ValidationPipe) UserDto: UserCreateRequestDto): Promise<UserResponseDto> {
    return await this.userService.createUser(UserDto);
  }

  @UseInterceptors(ResponseInterceptor)
  @Public()
  @Post('/signin')
  async signin(@Body(ValidationPipe) authCredentialsDto: LoginWithEmailRequestDTO): Promise<LoginResponseDTO>  {
    return await this.authService.login(authCredentialsDto);
  // async signin(@Body() user: User, @Res() res: FastifyReply) {
  //   return await this.authService.signin(user, res);
  }

  @UseInterceptors(ResponseInterceptor)
  @Public()
  @Post('/verify')
  async verify(@Body() dto: IAuthConfirmToken, @Res() res: FastifyReply) {
    return await this.authService.verifyAccount(dto, res);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @Get('/profile')
  async getProfile(@Request() req: FastifyRequest, @Res() res: FastifyReply) {
    return await this.authService.isValidToken(req, res);
  }

  // @UseGuards(JwtStrategy)
  // @UseInterceptors(ResponseInterceptor)
  // @Post('/user/create')
  // async createNewUser(@Body() dto: ICreateUserForm, @Res() res: FastifyReply) {
  //   return await this.authService.createNewUser(dto, res);
  // }

  // @UseGuards(JwtStrategy)
  // @UseInterceptors(ResponseInterceptor)
  // @Get('/users')
  // async getUsers(@Query() pageOptionsDto: PageOptionsDto) {
  //     return await this.userService.getUsers(pageOptionsDto);
  // }

  @UseGuards(JwtStrategy)
  @ApiOperation({ description: 'Change user password by id' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  // @Permissions('admin.access.users.update')
  @Put('/user/changepassword/:id')
  public changePassword(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) changePassword: UserChangePasswordRequestDto): Promise<UserResponseDto> {
    return this.userService.changePassword(id, changePassword);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get a paginated user list' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
  // @Permissions('admin.access.users.read', 'admin.access.users.create', 'admin.access.users.update')
  @Get('/users')
  public getUsers(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.userService.getUsers(pagination);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @Get('/decodeJWT')
  async getExpJWT(@Request() req: FastifyRequest, @Res() res: FastifyReply) {
    return await this.authService.getExpJWT(req, res);
  }

  @UseGuards(JwtStrategy)
  @ApiOperation({ description: 'Create new user' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiGlobalResponse(UserResponseDto)
  // @Permissions('admin.access.users.create')
  @Post('/user/create')
  public createUser(@Body(ValidationPipe) UserDto: UserCreateRequestDto): Promise<UserResponseDto> {
    return this.userService.createUser(UserDto);
  }

  @UseGuards(JwtStrategy)
  @UseInterceptors(ResponseInterceptor)
  @ApiOperation({ description: 'Get user by id' })
  @ApiGlobalResponse(UserResponseDto)
  // @Permissions('admin.access.users.read', 'admin.access.users.create', 'admin.access.users.update')
  @Get('/user/:id')
  public getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtStrategy)
  @ApiOperation({ description: 'Edit user by id' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  // @Permissions('admin.access.users.update')
  @Put('/user/:id')
  public editUserById(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) UserDto: UserUpdateRequestDto): Promise<UserResponseDto> {
    return this.userService.updateUser(id, UserDto);
  }
}
