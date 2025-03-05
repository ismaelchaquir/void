import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from '../shared/types';
import { Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Post('local/signup')
  // @HttpCode(HttpStatus.CREATED)
  // signupLocal(@Res() res: Response, @Body() dto: SignUpDto): Promise<any> {
  //   console.log('body', dto);
  //   return this.authService.signUpLocal(res, dto);
  // }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Res() res: Response, @Body() dto: SignInDto): Promise<any> {
    return this.authService.signInLocal(res, dto);
  }

  @Post('local/signout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.signOutLocal(userId);
  }

  @Public()
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refresh(
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(res, userId, refreshToken);
  }
}
