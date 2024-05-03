import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { Register } from './register';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../src/entities";
import { JwtModule } from '@nestjs/jwt';
import {dbdatasource} from "../src/typeorm.config";
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


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
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <justdevops99@gmail.com>',
      },
      template: {
        dir: join(__dirname, "../views/email-templates"),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [RegisterService, Register],
  exports: [RegisterService]
})
export class RegisterModule {}
