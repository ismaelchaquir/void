import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { requestNamespace } from 'src/domain/shared/util/request-namespace';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    requestNamespace.run(() => {
      const token = splitAuthorizationHeader(req.headers.authorization);
      requestNamespace.set('token', token);
      next();
    });
  }
}

export const getRequest = () => {
  return requestNamespace.get('token');
};

const splitAuthorizationHeader = (header: string) => {
  if (!header) return '';
  const token = header.split(' ')[1] || '';
  return token;
};
