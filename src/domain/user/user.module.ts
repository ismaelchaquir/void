import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { HashService } from '../shared/util';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [HashService, UserService],
})
export class UserModule {}
