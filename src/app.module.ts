import 'dotenv/config';

import { Module } from '@nestjs/common';

import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { dbConfig } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TaskModule, AuthModule],
})
export class AppModule {}
