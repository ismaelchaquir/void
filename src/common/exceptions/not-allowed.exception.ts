import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAllowedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN); // 403 Forbidden HTTP status code
  }
}
