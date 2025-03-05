import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { RequestContextMiddleware } from './common/middleware';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
