import { EntityRepository, Repository } from 'typeorm';
import { GetArticleFilterDto } from './dto/get-article-filter.dto';
import { Article } from './article.entity';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async getArticles(filterDto: GetArticleFilterDto): Promise<Article[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('article').leftJoinAndSelect(
      'article.categories',
      'categories',
    );

    if (search) {
      query.andWhere(
        '(LOWER(article.title) LIKE :search OR LOWER(article.content) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    return await query.getMany();
  }

  async getArticlesByCategories(categoriesIds) {
    return await this.createQueryBuilder('article')
      .leftJoinAndSelect('article.categories', 'category')
      .where(`category.id IN (:...categoriesIds)`, { categoriesIds })
      .getMany();
  }
}
