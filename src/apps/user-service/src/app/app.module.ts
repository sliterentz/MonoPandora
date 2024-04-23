import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../entites";
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      port: 5432,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_DEVELOPMENT,
      entities: [User],
      migrationsTableName: 'migration',
      migrations: ['./apps/user-service/migration/*.ts'],
      migrationsRun: process.env.TYPEORM_MIGRATION === 'true',
      synchronize: process.env.TYPEORM_MIGRATION === 'true',
      extra: {
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      },
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
        // signOptions: {
        //   algorithm: 'RS256',
        // }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
