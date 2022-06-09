import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { GetCategoryFilterDto } from './dto/get-category-filter.dto';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import {
  UpdateMainCategoryDto,
  UpdateSubCategoryDto,
} from './dto/update-category.dto';

@Controller('category')
@ApiTags('category')
@UseGuards(AuthGuard())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(@Query() filterDto: GetCategoryFilterDto): Promise<Category[]> {
    return this.categoryService.getCategories(filterDto);
  }

  @Get('/:id')
  getCategory(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategory(id);
  }

  @Post('/main')
  createMainCategory(
    @Body() createCategoryDto: CreateMainCategoryDto,
  ): Promise<any> {
    return this.categoryService.createCategory(createCategoryDto);
  }
  @Post('/sub')
  createSubCategory(
    @Body() createCategoryDto: CreateSubCategoryDto,
  ): Promise<any> {
    console.log(createCategoryDto.parent_id);
    if (!createCategoryDto.parent_id) {
      throw new BadRequestException('parent_id is required');
    }
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch('/:id/main')
  updateMainCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateMainCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Patch('/:id/sub')
  updateSubCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateSubCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
