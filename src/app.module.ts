import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ??
        'postgres://postgres:postgres@localhost:3001/wiki',
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['dist/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/migrations',
      },
      migrationsRun: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    AuthModule,
    UserModule,
    RoleModule,
    TasksModule,
    ProfileModule,
    CategoryModule,
    ArticleModule,
  ],
  controllers: [],
})
export class AppModule {}
