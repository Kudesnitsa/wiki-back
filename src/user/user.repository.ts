import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(search: string): Promise<User[]> {
    const query = this.createQueryBuilder('user').leftJoinAndSelect(
      'user.role',
      'role',
    );

    if (search) {
      query.andWhere(
        '( LOWER(user.username) LIKE LOWER(:search) OR ' +
          'LOWER(user.first_name) LIKE LOWER(:search)  OR ' +
          'LOWER(user.last_name) LIKE LOWER(:search)  OR ' +
          'LOWER(user.email) LIKE LOWER(:search) )',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async createUser(userDto: UserDto): Promise<User> {
    const { password } = userDto;

    const user = this.create({
      ...userDto,
      password: await this.hashPassword(password),
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async updatePassword(user: User, password: string): Promise<User> {
    user.password = await this.hashPassword(password);
    await this.save(user);
    return user;
  }
}
