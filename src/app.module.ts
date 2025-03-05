import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { RequestContextMiddleware } from './common/middleware';
import { DomainModule } from './domain/domain.module';
import { SeederModule } from './domain/seeder/seeder.module';
import { RoleSeeder } from './domain/seeder/role.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SeederModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService, RoleSeeder],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
