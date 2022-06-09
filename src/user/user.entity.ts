import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Role } from '../role/role.entity';
import { Exclude } from 'class-transformer';
import { Article } from '../article/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({
    nullable: true,
    default: null,
  })
  first_name: string;

  @Column({
    nullable: true,
    default: null,
  })
  last_name: string;

  @Column({
    nullable: true,
    default: null,
  })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @ManyToOne((_type) => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role' })
  role?: Role;

  @OneToMany((_type) => Article, (article) => article.author, { eager: true })
  articles: Article[];
}
