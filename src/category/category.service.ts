import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { GetCategoryFilterDto } from './dto/get-category-filter.dto';
import {
  CreateMainCategoryDto,
  CreateSubCategoryDto,
} from './dto/create-category.dto';
import {
  UpdateMainCategoryDto,
  UpdateSubCategoryDto,
} from './dto/update-category.dto';
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.entity';
import { In } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    private roleService: RoleService,
  ) {}

  async getCategories(filterDto: GetCategoryFilterDto): Promise<Category[]> {
    // return this.categoryRepository.getCategories(filterDto);
    return this.categoryRepository.getCategories(filterDto);
  }

  async getCategory(id: string): Promise<Category> {
    const found = await this.categoryRepository.findOne({
      relations: ['roles'],
      where: { id },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createCategory(
    // todo FIX types issue
    createCategoryDto: CreateMainCategoryDto | CreateSubCategoryDto | any,
  ): Promise<any> {
    let roles: Role[];
    if (createCategoryDto.roles) {
      roles = await this.roleService.getRolesByIds(createCategoryDto.roles);
    }
    let category = await this.categoryRepository.create({
      ...createCategoryDto,
      roles,
    });
    category = await this.categoryRepository.save(category);
    return category;
  }

  async deleteCategory(id): Promise<void> {
    try {
      const resolve = await this.categoryRepository.delete(id);
      if (resolve.affected === 0) {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'You cannot delete the category to which the article is linked',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getCategoriesByIds(ids: string[]): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({ where: { id: In(ids) } });
    } catch (error) {
      if (error.code === '22P02') {
        throw new BadRequestException('Role not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getCategoriesByRoleId(roleId) {
    return await this.categoryRepository.getCategoriesByRoleId(roleId);
  }

  async updateCategory(
    id: string,
    updatedCategory: UpdateMainCategoryDto | UpdateSubCategoryDto | any,
  ): Promise<Category> {
    // eslint-disable-next-line prefer-const
    let { sub, ...category } = await this.getCategory(id);

    if (updatedCategory.hasOwnProperty('roles')) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      category = this.categoryRepository.create({
        ...category,
        ...updatedCategory,
      });

      if (new Set(updatedCategory.roles).size < updatedCategory.roles.length) {
        throw new BadRequestException('Roles are not unique');
      }
      category.roles = await this.roleService.getRolesByIds(
        updatedCategory.roles,
      );
    }

    return await this.categoryRepository.save({ ...category });
  }
}
