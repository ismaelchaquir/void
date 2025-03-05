import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload, Tokens } from '../shared/types';
import { SignInDto, SignUpDto } from './dto';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '../shared/util';
import * as argon from 'argon2';
import { Response } from 'express';
import { REFRESHTOKEN } from 'src/app.constants';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getRequest } from '@/common/middleware';

const refreshTokenDuration = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private bcryptHashService: HashService,
  ) {}

  async signInLocal(res: Response, dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await this.bcryptHashService.verifyData(
      dto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);
    res.cookie(REFRESHTOKEN, tokens.refresh_token, {
      expires: new Date(Date.now() + refreshTokenDuration),
      maxAge: refreshTokenDuration / 1000, // maxAge in seconds
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.status(HttpStatus.OK).json({
      access_token: tokens.access_token,
    });
  }

  async signOutLocal(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    return true;
  }

  async refreshTokens(res: Response, userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied');

    const rtMatches = await argon.verify(user.refreshToken, refreshToken);
    if (!rtMatches) throw new UnauthorizedException('Access Denied');

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refresh_token);
    res.cookie(REFRESHTOKEN, tokens.refresh_token, {
      expires: new Date(Date.now() + refreshTokenDuration),
      maxAge: refreshTokenDuration / 1000, // maxAge in seconds
      httpOnly: true,
      sameSite: 'lax',
    });

    return res
      .status(HttpStatus.OK)
      .json({ access_token: tokens.access_token });
  }

  async getTokens(userId: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async getAuthenticatedUser() {
    const user = getRequest();

    const result = await this.validateToken(user);
    return result; // Access the user object attached by your auth guard
  }

  async getAuthenticatedUserId() {
    const user = await this.getAuthenticatedUser();
    return user?.sub; // Or any identifier used for your user
  }

  private async validateToken(token: string): Promise<JwtPayload> {
    if (token) {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('AT_SECRET'),
      });
    }
    return null;
  }
}
