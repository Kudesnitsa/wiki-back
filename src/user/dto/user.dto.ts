import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is too weak:
      Passwords will contain at least 1 upper case letter;
      Passwords will contain at least 1 lower case letter;
      Passwords will contain at least 1 number or special character`,
  })
  password: string;

  @IsString()
  @ApiProperty()
  @MinLength(2)
  @MaxLength(54)
  first_name: string;

  @IsString()
  @ApiProperty()
  @MinLength(2)
  @MaxLength(54)
  last_name: string;

  @IsString()
  @ApiProperty()
  @MinLength(2)
  @MaxLength(54)
  @IsEmail()
  email: string;
}
