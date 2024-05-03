import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterModule } from "../../register/register.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../entities";
import { JwtModule } from '@nestjs/jwt';
import { dbdatasource } from '../typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbdatasource),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
        // signOptions: {
        //   algorithm: 'RS256',
        // }
    }),
    RegisterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
