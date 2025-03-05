import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDocument } from './docs/swagger';
import { AccessTokenGuard } from './common/guards';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: false,
    }),
  );
  createDocument(app);
  await app.listen(3000);
}
bootstrap();
