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
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { GetUser } from '../auth/get-user.decorator';
import { updateUserPasswordDto } from './dto/update-user-password.dto';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  @Roles('Super Admin')
  createUser(@Body() createUserDto: UserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles('Super Admin')
  getUsers(@Query('search') search: string): Promise<User[]> {
    return this.userService.getUsers(search);
  }

  @Delete('/:id')
  @Roles('Super Admin')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch('/:id')
  @Roles('Super Admin')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put('/:id/role')
  @Roles('Super Admin')
  updateRole(
    @Param('id') id: string,
    @Body() roleId: UpdateUserRoleDto,
  ): Promise<User> {
    return this.userService.updateRole(id, roleId);
  }

  @Patch('/password/change')
  updatePassword(
    @GetUser() user: User,
    @Body() passwords: updateUserPasswordDto,
  ): Promise<User> {
    return this.userService.updatePassword(passwords, user);
  }
}
