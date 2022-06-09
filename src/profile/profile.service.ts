import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  async deleteUser(user: User): Promise<void> {
    if (user.role.title === 'Super Admin' && user.username === 'super.admin') {
      throw new ForbiddenException(`This user cannot be delete`);
    }
    await this.usersRepository.delete(user.id);
  }

  async updateUser(user: User, updateData: UpdateUserDto): Promise<User> {
    user = { ...user, ...updateData };
    await this.usersRepository.save(user);
    return user;
  }
}
