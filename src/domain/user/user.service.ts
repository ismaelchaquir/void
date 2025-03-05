import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { HashService } from '../shared/util';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private bcryptHashService: HashService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const type =
      dto.type === 'user' || dto.type === 'manager' ? dto.type : null;

    if (!type) {
      throw new BadRequestException(
        'Invalid type. Type must be either "user" or "manager".',
      );
    }

    const newRole = await this.prisma.role.findFirst({
      where: { name: type },
      include: {
        permissions: true, // Include the specific permissions for this role
      },
    });

    const hashedPassword = await this.bcryptHashService.hashData(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        roles: {
          connect: { id: newRole.id },
        },
      },
    });
    return user;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const permissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => ({
        resource: permission.resource,
        actions: permission.actions,
      })),
    );

    return permissions;
  }
}
