import { Module } from '@nestjs/common';
import { RoleSeeder } from './role.service';

Module({
  providers: [RoleSeeder],
  exports: [RoleSeeder],
});
export class SeederModule {}
