import { IsNotEmpty, IsOptional, IsString, NotEquals } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  description: string;
}

export class CreateMainCategoryDto extends CreateCategoryDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  roles: string[];
}

export class CreateSubCategoryDto extends CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  parent_id: string;
}
