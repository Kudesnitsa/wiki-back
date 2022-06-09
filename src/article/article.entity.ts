import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne((_type) => User, (user) => user.articles, { eager: false })
  author: User;

  @ManyToMany((_type) => Category, (category) => category.articles)
  @JoinTable()
  categories: Category[];
}
