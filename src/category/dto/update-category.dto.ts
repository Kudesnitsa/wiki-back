import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  description: string;
}

export class UpdateMainCategoryDto extends UpdateCategoryDto {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  roles: string[];
}

export class UpdateSubCategoryDto extends UpdateCategoryDto {}
