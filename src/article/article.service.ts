import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticleFilterDto } from './dto/get-article-filter.dto';
import { User } from '../user/user.entity';
import { Article } from './article.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
    private categoryService: CategoryService,
  ) {}

  async getArticles(filterDto: GetArticleFilterDto): Promise<Article[]> {
    return this.articleRepository.getArticles(filterDto);
  }

  async getArticle(id: string): Promise<Article> {
    const found = await this.articleRepository.findOne(id, {
      relations: ['categories', 'author'],
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async getArticlesByRole(roleId: string): Promise<Article[]> {
    const categories = await this.categoryService.getCategoriesByRoleId(roleId);
    console.log(categories, roleId);
    const categoriesIds = categories.map((c) => c.id);
    console.log(categoriesIds);
    const found = await this.articleRepository.getArticlesByCategories(
      categoriesIds,
    );
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<any> {
    let categories: Category[];
    if (createArticleDto.categoriesIds) {
      categories = await this.categoryService.getCategoriesByIds(
        createArticleDto.categoriesIds,
      );
    }
    const article = await this.articleRepository.create({
      ...createArticleDto,
      categories,
      author: user,
    });
    return await this.articleRepository.save(article);
  }

  async deleteArticle(id): Promise<void> {
    const resolve = await this.articleRepository.delete({
      id,
    });
    if (resolve.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<any> {
    let categories: Category[];
    const article = await this.articleRepository.findOne(id);
    if (updateArticleDto.categoriesIds) {
      categories = await this.categoryService.getCategoriesByIds(
        updateArticleDto.categoriesIds,
      );
    }
    const newArticle = await this.articleRepository.create({
      ...article,
      ...updateArticleDto,
      categories,
    });
    return await this.articleRepository.save(newArticle);
  }
}
