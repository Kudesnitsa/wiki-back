import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @IsString()
  @ApiProperty()
  roleId: string;
}
