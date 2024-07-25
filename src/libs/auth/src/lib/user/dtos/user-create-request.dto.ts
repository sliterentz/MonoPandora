import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class UserCreateRequestDto {
  @IsNotEmpty()
  // @IsAlphanumeric()
  @ApiProperty({
    example: 'Jhon Doe',
  })
  fullname!: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'jony78@gmail.com',
  })
  email!: string;

  // @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: '+62825523100',
  })
  phone!: string;

  @Matches(passwordRegex, { message: 'Password too weak' })
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 20)
  @ApiProperty({
    example: 'Hello123',
  })
  password!: string;

  // @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'doe99',
  })
  username!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: false,
  })
  isSuperUser!: Boolean;

  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  isVerified!: Boolean;

  // @IsNotEmpty()
  // @MaxLength(100)
  @ApiProperty({
    example: 'Samsung LTD',
  })
  company!: string;

  // @IsNotEmpty()
  // @MaxLength(100)
  @ApiProperty({
    example: 'http://localhost:8080/public/images/avatar/avatar_1.jpg',
  })
  avatarUrl!: string;

  @ApiProperty({ example: [1, 2] })
  // @ArrayNotEmpty()
  // @IsArray()
  // @IsInt({ each: true })
  permissions?: number[];

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  roles?: number[];
}
