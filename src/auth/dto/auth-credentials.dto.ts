import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @IsString()
  @ApiProperty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
