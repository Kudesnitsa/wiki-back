import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateUserPasswordDto {
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
  newPassword: string;

  @IsString()
  @ApiProperty()
  oldPassword: string;
}
