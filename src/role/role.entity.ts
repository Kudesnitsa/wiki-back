import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @OneToMany((_type) => User, (user) => user.role, { eager: false })
  users: User[];

  @ManyToMany(() => Category, (category) => category.roles)
  categories: Category[];
}
