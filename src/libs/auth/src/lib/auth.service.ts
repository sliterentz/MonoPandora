import { BadRequestException, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from "bcryptjs";
import { UserService } from './user/user.service';
import { UserEntity as User } from './entities';
import { UserRepository as UserRepo } from './repositories/user.repository';
import { JwtPayloadInterface } from './interfaces';
import { AuthModel } from './models';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
// import { RegisterRequestDTO } from './dtos/register-request.dto';
import { LoginWithEmailRequestDTO } from './dtos/login-withemail-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { CreateUserRequestDTO } from './dtos/create-user-request.dto';
import { VerifyConfirmDTO } from './dtos/verify-confirm.dto';
// import { ProfileRequestDTO } from './dtos/profile-request.dto';
// import { RefreshTokenDTO } from './dtos/refresh-token.dto';
// import { IJwtConfig, IRefreshToken, accessTokenConfig, refreshTokenConfig, IAccessTokenPayload } from './types/auths';
import Logger, { LoggerKey } from '@nestjs-logger/shared/lib/interfaces/logger.interface';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsException, DisabledUserException, HashUtilsHelper } from './helpers';
import { IStatus, ErrorType } from './types';
import { TokenService } from './token.service';
import { UserMapper } from './user/user.mapper';
import { IAccessTokenPayload as JwtPayload } from './types';

dotenv.config();

@Injectable()
export class AuthService {
  // private code;
  // private context = `[AuthService] `;
  constructor(
    // @InjectRepository(User)
    // private userRepo: Repository<User>,
    @Inject(LoggerKey)
    private logger: Logger,
    private usersRepository: UserRepo,
    // @InjectRepository(RefreshToken)
    // private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private tokenService: TokenService,
    ) {
    // this.code = Math.floor(10000 + Math.random() * 90000);
  }

  // async signup(req: RegisterRequestDTO, result: FastifyReply): Promise<any> {
  //   try {
  //     const existingUser = await this.userService.findByEmail(req.email);
  //
  //     let response = {
  //       message: 'Successfull register',
  //       code: 200,
  //       data: []
  //     };
  //
  //     if (existingUser) {
  //       response = {
  //         message: 'Email allready taken',
  //         code: 400,
  //         data: []
  //       };
  //
  //       return result.code(400).type('application/json').send(response);
  //     }
  //
  //     const newUser = await this.userService.createUser(req);
  //
  //     if (newUser) {
  //       response = {
  //         message: 'Registered succesfully',
  //         code: 200,
  //         data: newUser
  //       };
  //       return result.code(200).type('application/json').send(response);
  //     } else {
  //       response = {
  //         message: 'Registration process failed',
  //         code: 400,
  //         data: []
  //       };
  //       return result.code(400).type('application/json').send(response);
  //     }
  //
  //   } catch (error) {
  //     let response = {
  //       message: 'Internal error exception',
  //       code: 500,
  //       data: []
  //     };
  //
  //     return result.code(500).type('application/json').send(response);
  //   }
  // }

  async sendConfirmedEmail(user: User) {
    const { email, fullname } = user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Monopando App! Email Confirmed',
      template: 'confirmed',
      context: {
        fullname,
        email
      },
    });
  }

  async verifyAccount(code: VerifyConfirmDTO, result: FastifyReply): Promise<any> {
    try {
      // await this.sendConfirmedEmail(user)

      await this.userService.generateUserToken(code);
      const isSuccess = await this.userService.verifyUser(code);

      let response = {
        message: 'Successfull activating',
        code: 200,
        data: true
      };

      if (isSuccess) {
        return result.code(200).type('application/json').send(response);
      }

      response = {
        message: 'User allready activated',
        code: 400,
        data: false
      };

      return result.code(400).type('application/json').send(response);

    } catch (error) {
      let response = {
        message: 'Internal error exception',
        code: 500,
        data: false
      };

      return result.code(500).type('application/json').send(response);
    }
  }
  
  /**
   * User authentication
   * @param authCredentialsDto {LoginWithEmailRequestDTO}
   * @returns {Promise<LoginResponseDTO>}
   */
  public async login({ email, password }: LoginWithEmailRequestDTO): Promise<LoginResponseDTO> {
    const user: User = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await HashUtilsHelper.compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
    if (user.status == IStatus.Suspend) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
    if (user.status == IStatus.Disable) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }

    const payload: JwtPayload = { id: user.id, email: user.email };
    const token = await this.tokenService.generateAuthToken(payload);

    const userDto = await UserMapper.toDto(user);
    const { permissions = [], roles = [] } = await UserMapper.toDtoWithRelations(user);
    const additionalPermissions = permissions.map(({ permissionName }) => permissionName);
    const mappedRoles = roles.map(({ roleName, permissions }) => {
      const rolePermissions = permissions?.map(({ permissionName }) => permissionName);
      return {
        roleName,
        permissions: rolePermissions,
      };
    });

    return {
      user: userDto,
      token,
      access: {
        additionalPermissions,
        roles: mappedRoles.map(({ roleName, permissions }) => ({
          roleName,
          permissions: permissions || [], // Set default value to empty array
        })),
      },
    };
  }

  async signin(user: User, result: FastifyReply): Promise<any> {
      // Profile
      this.logger.startProfile('signin');
    try {
      const validateLogin = await this.userService.signin(user);

      let response = {
        message: 'Successfull login',
        code: 200,
        data: []
      };

      if (!validateLogin) {
        // Fatal
        this.logger.fatal('Incorrect username or password', {
          props: {
            request: `"${JSON.stringify(user)}"`,
          },
          error: new Error('Unauthorize request'),
        });
        response = {
          message: 'User allready activated',
          code: 400,
          data: []
        };

        return result.code(400).type('application/json').send(response);
      }

      response = {
        message: 'Successfull login',
        code: 200,
        data: validateLogin
      };

      return result.code(200).type('application/json').send(response);
    } catch (error) {
      // Error
      this.logger.error('Incorrect username or password', {
        props: {
          request: `"${JSON.stringify(user)}"`,
        },
        error: new Error('Unauthorize request'),
      });

      let response = {
        message: 'Internal error exception',
        code: 500,
        data: false
      };

      return result.code(500).type('application/json').send(response);
    }
  }

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.userService.findById(payload.id);
  }

  async authenticate(payload: AuthModel): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(payload.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isRightPassword = await bcrypt.compare(payload.password, user?.password);

    if (!isRightPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      isSuperUser: user.isSuperUser,
      fullname: user.fullname,
      accessToken: await this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async isValidToken(token: FastifyRequest, result: FastifyReply): Promise<any> {
    try {

      let accessToken = '';
      const tokenSegmen = token.headers.authorization?.split(" ");
      if(tokenSegmen) {
        accessToken = tokenSegmen[1];
      }

      const hasValidAccess = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env['JWT_SECRET']
      });

      let response = {
        message: 'Successfull',
        code: 200,
        data: [{}]
      };

      if(!hasValidAccess) {

        // Fatal
        this.logger.fatal('Unauthorized access', {
          props: {
            request_ip: `"${token.ip}"`,
          },
          error: new Error('Unauthorized access, Invalid credentials'),
        });
        response = {
          message: 'Invalid credentials',
          code: 401,
          data: []
        };

        return result.code(401).type('application/json').send(response);
      }

      const userData = await this.userService.findById(hasValidAccess.id);

      if (!userData) {

        // Fatal
        this.logger.fatal('Bad request', {
          props: {
            request_ip: `"${token.ip}"`,
          },
          error: new Error('Bad request, No user existed'),
        });
        response = {
          message: 'User not existed',
          code: 404,
          data: []
        };

        return result.code(404).type('application/json').send(response);
      }

      const userProfile = {
        'name' : userData.fullname,
        'email': userData.email,
      }

      response = {
        message: 'Success',
        code: 200,
        data: [userProfile]
      };

      //
      return result.code(200).type('application/json').send(response);

    } catch(error) {
      let response = {
        message: 'Internal error exception',
        code: 500,
        data: []
      };

      return result.code(500).type('application/json').send(response);
    }
  }

  async createNewUser(req: CreateUserRequestDTO, result: FastifyReply): Promise<any> {
    try {
      const existingUser = await this.userService.findByUserName(req.username);

      let response = {
        message: 'Successfull register',
        code: 200,
        data: []
      };

      if (existingUser) {
        response = {
          message: 'Username allready taken',
          code: 400,
          data: []
        };

        return result.code(400).type('application/json').send(response);
      }

      const newUser = await this.userService.createUserAdmin(req);

      if (newUser) {
        response = {
          message: 'Registered succesfully',
          code: 200,
          data: newUser
        };
        return result.code(200).type('application/json').send(response);
      } else {
        response = {
          message: 'Registration process failed',
          code: 400,
          data: []
        };
        return result.code(400).type('application/json').send(response);
      }

    } catch (error) {
      let response = {
        message: 'Internal error exception',
        code: 500,
        data: []
      };

      return result.code(500).type('application/json').send(response);
    }
  }

  async getExpJWT(token: FastifyRequest, result: FastifyReply): Promise<any> {
    let accessToken = '';
      const tokenSegmen = token.headers.authorization?.split(" ");
      if(tokenSegmen) {
        accessToken = tokenSegmen[1];
      }

      // const hasValidAccess = await this.jwtService.verifyAsync(accessToken, {
      //   secret: process.env['JWT_SECRET']
      // });

      let response = {
        message: 'Successfull',
        code: 200,
        data: [{}]
      };

    const decodedJWT = await this.jwtService.decode(accessToken) as { exp: number };

    response = {
      message: 'Success',
      code: 200,
      data: [decodedJWT]
    };

    return result.code(200).type('application/json').send(response);
  }

}
