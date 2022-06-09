import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticleFilterDto } from './dto/get-article-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Article } from './article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
@UseGuards(AuthGuard())
@ApiTags('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('/:id')
  getArticle(@Param('id') id: string): Promise<Article> {
    return this.articleService.getArticle(id);
  }

  @Get('role/:id')
  getArticleByRole(@Param('id') roleId: string): Promise<Article[]> {
    return this.articleService.getArticlesByRole(roleId);
  }

  @Post()
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Get()
  getArticles(@Query() filterDto: GetArticleFilterDto): Promise<Article[]> {
    return this.articleService.getArticles(filterDto);
  }

  @Delete('/:id')
  deleteArticle(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.articleService.deleteArticle(id);
  }

  @Patch('/:id')
  updateArticleStatus(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<any> {
    return this.articleService.updateArticle(id, updateArticleDto);
  }
}
