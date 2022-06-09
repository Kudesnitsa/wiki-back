import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleFilterDto } from './dto/get-role-filter.dto';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository) private roleRepository: RoleRepository,
  ) {}

  async getRoles(filterDto: GetRoleFilterDto): Promise<Role[]> {
    return this.roleRepository.getRoles(filterDto);
  }

  async getRolesByIds(ids: string[]): Promise<Role[]> {
    try {
      return await this.roleRepository.find({ where: { id: In(ids) } });
    } catch (error) {
      if (error.code === '22P02') {
        throw new BadRequestException('Role not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getRole(id: string): Promise<Role> {
    const found = await this.roleRepository.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.createRole(createRoleDto);
  }

  async isSuperAdmin(id: string) {
    const role = await this.getRole(id);
    if (role.title === 'Super Admin') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `The Super Admin role cannot be delete or updated`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteRole(id): Promise<void> {
    await this.isSuperAdmin(id);
    const resolve = await this.roleRepository.delete(id);
    if (resolve.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateRole(id: string, title: string): Promise<Role> {
    await this.isSuperAdmin(id);
    const role = await this.getRole(id);
    role.title = title;
    await this.roleRepository.save(role);
    return role;
  }
}
