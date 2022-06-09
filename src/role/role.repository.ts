import { EntityRepository, Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleFilterDto } from './dto/get-role-filter.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.create({ ...createRoleDto });

    try {
      await this.save(role);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Role title already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return role;
  }

  async getRoles(filterDto: GetRoleFilterDto): Promise<Role[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('role');

    if (search) {
      query.andWhere('LOWER(role.title) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    return await query.getMany();
  }
}
