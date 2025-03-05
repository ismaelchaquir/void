import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/domain/shared/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    console.log('sub', user);
    return user.sub;
  },
);
