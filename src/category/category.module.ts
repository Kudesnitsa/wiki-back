import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    AuthModule,
    RoleModule,
    TypeOrmModule.forFeature([CategoryRepository]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
