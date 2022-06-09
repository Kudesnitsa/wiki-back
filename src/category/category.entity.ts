import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Article } from '../article/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // todo not empty
  @Column({ unique: true })
  title: string;

  @Column({ default: '' })
  description: string;

  @Column('uuid', {
    nullable: true,
    default: null,
  })
  parent_id: string;

  @ManyToMany(() => Role, (role) => role.categories)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];

  sub: Category[];
}
