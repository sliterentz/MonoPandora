import { Injectable, NotFoundException, RequestTimeoutException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { UserEntity as User } from '../entities';
import { UserModel } from "../models";
// import { JwtService } from '@nestjs/jwt';
import { UserRepository as UserRepo, RefreshTokenRepository as TokenRepo } from '../repositories';
import { IVerrifyConfirmForm } from '../types';

// import { PageDto } from '../dtos/page.dto';
// import { PageMetaDto } from '../dtos/page-meta.dto';
// import { PageOptionsDto } from '../dtos/page-options.dto';
// import { UserDto } from '../dtos/user.dto';
import { UserUpdateRequestDto, UserResponseDto, UserChangePasswordRequestDto, UserCreateRequestDto } from './dtos';
import { UserMapper } from './user.mapper';
import { ForeignKeyConflictException, UserExistsException, EmailExistsException, PhoneExistsException, InvalidCurrentPasswordException } from '../helpers';
import { DBErrorCode, DBError } from '../types'
import { TimeoutError } from 'rxjs';
import { HashUtilsHelper } from '../helpers';
import { PaginationRequest  } from '../interfaces';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';
import { Pagination } from '../helpers';

@Injectable()
export class UserService {
    // private saltRounds: number;
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersRepository: UserRepo,
    private refreshTokenRepository : TokenRepo,
    // private jwtService: JwtService,
) { // this.saltRounds = 10;
    }

  // async createUser(payload: AuthModel): Promise<any> {
  //   return await this.usersRepository.createUser(payload);
  // }

  async createUserAdmin(payload: UserModel): Promise<any> {
    return await this.usersRepository.createUserAdmin(payload);
  }

  async verifyUser(code: IVerrifyConfirmForm): Promise<any> {
    // await this.refreshTokenRepository.createToken(code);
    return await this.usersRepository.verifyUser(code);
  }

  async signin(user: User): Promise<any> {
    return await this.usersRepository.userSignin(user);
  }

  async generateUserToken(code: IVerrifyConfirmForm): Promise<any> {
    return await this.refreshTokenRepository.createToken(code);
  }

  async checkRefreshToken(userId: string): Promise<any> {
    return await this.refreshTokenRepository.checkTokenExpiredbyUserId(userId);
  }

  async refreshUserToken(userId: string): Promise<any> {
    return await this.refreshTokenRepository.reCreateToken(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async findByUserName(userName: string): Promise<User | null> {
    return await this.usersRepository.findByUserName(userName);
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  // async findAll(): Promise<User[]> {
  //   return await this.userRepository.find();
  // }

  async findByEmailWithPassword(email: string | undefined): Promise<User | null> {
    return await this.userRepository.findOne({
        where: {
            email,
        },
    });
  }

  // async findByConfirmToken(authConfirmToken: number): Promise<User | null> {
  //   return await this.userRepository.findOne({
  //     where: {
  //       authConfirmToken,
  //     },
  //   });
  // }

  /**
   * Get a paginated user list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<UserResponseDto>>}
   */
  public async getUsers(pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    try {
      const [userEntities, totalUsers] = await this.usersRepository.getUsersAndCount(pagination);

      const UserDtos = await Promise.all(userEntities.map(UserMapper.toDtoWithRelations));
      return Pagination.of(pagination, totalUsers, UserDtos);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
  //   const queryBuilder = this.userRepository.createQueryBuilder('user');
  //
  //   queryBuilder
  //     .orderBy('user.createdAt', pageOptionsDto.order)
  //     .skip(pageOptionsDto.skip)
  //     .take(pageOptionsDto.take);
  //
  //   const itemCount = await queryBuilder.getCount();
  //   const { entities } = await queryBuilder.getRawAndEntities();
  //
  //   const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  //
  //   return new PageDto(entities, pageMetaDto);
  // }

  /**
   * Get user by id
   * @param id {string}
   * @returns {Promise<UserResponseDto>}
   */
    public async getUserById(id: string): Promise<UserResponseDto> {
      const user = await this.userRepository.findOne({
          where: { id }
      });
      if (!user) {
        throw new NotFoundException();
      }

      const userDto = await UserMapper.toDto(user);
      const { roles = [] } = await UserMapper.toDtoWithRelations(user);
      const mappedRoles = roles.map(({ id }) => ({ id }));

      return {
        id: userDto.id,
        fullname: userDto.fullname,
        email: userDto.email,
        phone: userDto.phone,
        // password: userDto.password,
        isSuperUser: userDto.isSuperUser,
        // authConfirmToken: userDto.authConfirmToken,
        isVerified: userDto.isVerified,
        username: userDto.username,
        company: userDto.company,
        avatarUrl: userDto.avatarUrl,
        status: userDto.status,
        roleIds: mappedRoles.map(role => role.id as number),
      }
    }

  /**
   * Create new user
   * @param userDto {UserCreateRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async createUser(userDto: UserCreateRequestDto): Promise<UserResponseDto> {
    try {
      let userEntity = UserMapper.toCreateEntity(userDto);
      userEntity.password = await HashUtilsHelper.encrypt(userEntity.password);
      userEntity = await this.userRepository.save(userEntity);
      return UserMapper.toDto(userEntity);
    } catch (error) {
      const dbError = error as DBError;
      // console.log(dbError.detail?.includes('email'));
      if (dbError.detail?.includes('username')) {
        throw new UserExistsException(userDto.username);
      }
      if (dbError.detail?.includes('email')) {
        throw new EmailExistsException(userDto.email);
      }
      if (dbError.detail?.includes('phone')) {
        throw new PhoneExistsException(userDto.phone);
      }
      if (
        dbError.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        dbError.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Update User by id
   * @param id {string}
   * @param userDto {UserUpdateRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async updateUser(id: string, userDto: UserUpdateRequestDto): Promise<UserResponseDto> {
    let userEntity = await this.userRepository.findOne({
      where: { id }
    });
    if (!userEntity) {
      throw new NotFoundException();
    }

    try {
      userEntity = UserMapper.toUpdateEntity(userEntity, userDto);
      userEntity = await this.userRepository.save(userEntity);
      return UserMapper.toDto(userEntity);
    } catch (error) {
      const dbError = error as DBError;
      if (dbError.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(userDto.username);
      }
      if (
        dbError.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        dbError.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Change user password
   * @param userId {string}
   * @param changePassword {UserChangePasswordRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async changePassword(userId: string, changePassword: UserChangePasswordRequestDto): Promise<UserResponseDto> {
    const { currentPassword, newPassword } = changePassword;

    const userEntity = await this.userRepository.findOne({ where: { id: userId } });

    if (!userEntity) {
      throw new NotFoundException();
    }

    const passwordMatch = await HashUtilsHelper.compare(currentPassword, userEntity.password);

    if (!passwordMatch) {
      throw new InvalidCurrentPasswordException();
    }
    try {
      userEntity.password = await HashUtilsHelper.encrypt(newPassword);
      await this.userRepository.save(userEntity);
      return UserMapper.toDto(userEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
