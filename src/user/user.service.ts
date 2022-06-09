import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { updateUserPasswordDto } from './dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private roleService: RoleService,
  ) {}

  async getUsers(search: string): Promise<User[]> {
    return this.usersRepository.getUsers(search);
  }

  async getUser(id: string): Promise<User> {
    const found = await this.usersRepository.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  createUser(user: UserDto): Promise<User> {
    return this.usersRepository.createUser(user);
  }

  async deleteUser(id): Promise<void> {
    const resolve = await this.usersRepository.delete(id);
    if (resolve.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    let user = await this.getUser(id);
    user = { ...user, ...updateData };
    await this.usersRepository.save(user);
    return user;
  }

  async updateRole(id: string, role: UpdateUserRoleDto): Promise<User> {
    const { roleId } = role;
    const user = await this.getUser(id);
    user.role = await this.roleService.getRole(roleId);
    await this.usersRepository.save(user);
    return user;
  }

  async updatePassword(
    passwords: updateUserPasswordDto,
    user: User,
  ): Promise<User> {
    const { oldPassword, newPassword } = passwords;
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new ForbiddenException('Please check your credentials');
    }
    return this.usersRepository.updatePassword(user, newPassword);
  }
}
