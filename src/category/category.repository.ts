import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { GetCategoryFilterDto } from './dto/get-category-filter.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getCategories(filterDto: GetCategoryFilterDto): Promise<Category[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('category')
      .leftJoinAndMapMany(
        'category.sub',
        Category,
        'sb',
        'category.id = sb.parent_id',
      )
      .leftJoinAndSelect('category.roles', 'role')
      .where(`category.parent_id is null`);

    if (search) {
      query.andWhere(
        '(LOWER(category.title) LIKE :search OR LOWER(category.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    return await query.getMany();
  }

  async getCategoriesByRoleId(roleId: string): Promise<any> {
    return await this.createQueryBuilder('category')
      .leftJoinAndSelect('category.roles', 'role')
      .where(`role.id = :roleId`, { roleId })
      .getMany();
  }
}
