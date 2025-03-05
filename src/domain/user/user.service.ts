import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { HashService } from '../shared/util';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private bcryptHashService: HashService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await this.bcryptHashService.hashData(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        type: dto.type === 'user' ? 'user' : 'manager',
        password: hashedPassword,
      },
    });
    return user;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
