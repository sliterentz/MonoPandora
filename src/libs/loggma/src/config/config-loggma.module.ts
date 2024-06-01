import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigLoggmaService } from './config-loggma.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [ConfigLoggmaService],
  exports: [ConfigLoggmaService],
})
export class ConfigLoggmaModule {}
