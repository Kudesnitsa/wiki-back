import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ProfileService } from './profile.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/user.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@ApiTags('profile')
@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getUser(@GetUser() user: User): User {
    return user;
  }

  @Delete()
  deleteUser(@GetUser() user: User): Promise<void> {
    return this.profileService.deleteUser(user);
  }

  @Patch()
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.profileService.updateUser(user, updateUserDto);
  }
}
