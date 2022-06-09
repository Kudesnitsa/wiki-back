import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRoleFilterDto } from './dto/get-role-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from './role.guard';
import { Roles } from './roles.decorator';

@ApiTags('role')
@Controller('role')
@UseGuards(AuthGuard(), RoleGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('/:id')
  getRole(@Param('id') id: string): Promise<Role> {
    return this.roleService.getRole(id);
  }

  @Post()
  @Roles('Super Admin')
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  getRoles(@Query() filterDto: GetRoleFilterDto): Promise<Role[]> {
    return this.roleService.getRoles(filterDto);
  }

  @Delete('/:id')
  @Roles('Super Admin')
  deleteRole(@Param('id') id: string): Promise<void> {
    return this.roleService.deleteRole(id);
  }

  @Patch('/:id')
  @Put('/:id')
  @Roles('Super Admin')
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleStatusDto: UpdateRoleDto,
  ): Promise<Role> {
    const { title } = updateRoleStatusDto;
    return this.roleService.updateRole(id, title);
  }
}
