import { Global, Module } from '@nestjs/common';
import { v4 } from 'uuid';
import { ClsModule } from 'nestjs-cls';

import { ContextStorageInterfaceKey } from '@nestjs-logger/shared/lib/interfaces/context-storage.interface';
import NestjsClsContextStorageService from '@nestjs-logger/shared/lib/context/context-loggma.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['x-correlation-id'] ?? v4(),
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: ContextStorageInterfaceKey,
      useClass: NestjsClsContextStorageService,
    },
  ],
  exports: [ContextStorageInterfaceKey],
})
export class ContextLoggmaModule {}
