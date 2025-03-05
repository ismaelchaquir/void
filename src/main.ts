import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDocument } from './docs/swagger';
import { AccessTokenGuard } from './common/guards';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { RoleSeeder } from './domain/seeder/role.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Run database seeder
  try {
    const seeder = app.get(RoleSeeder);
    await seeder.seed();
  } catch (error) {
    logger.error('Error during database seeding:', error);
  }

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
