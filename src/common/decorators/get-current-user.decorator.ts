import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REFRESHTOKEN } from 'src/app.constants';
import { JwtPayloadWithRt } from 'src/domain/shared/types/jwt-payload-rt';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!data) return request.user;
    return request.user[data];
  },
);
