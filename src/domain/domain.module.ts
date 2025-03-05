import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './shared/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule, UserModule],
})
export class DomainModule {}
