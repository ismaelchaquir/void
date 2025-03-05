import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Public } from '@/common/decorators';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Public()
  public async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }
}
