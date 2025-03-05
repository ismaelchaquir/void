import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies/refresh-jwt-strategy';
import { AuthController } from './auth.controller';
import { HashService } from '../shared/util';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    HashService,
  ],
})
export class AuthModule {}

