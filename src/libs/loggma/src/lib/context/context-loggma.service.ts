import ContextStorageInterface from '@nestjs-logger/shared/lib/interfaces/context-storage.interface';
import { CLS_ID, ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ContextLoggmaService
  implements ContextStorageInterface
{

  constructor(private readonly cls: ClsService) {
    this.cls = cls;
  }

  public get<T>(key: string): T | undefined {
    return this.cls.get(key);
  }

  public setContextId(id: string) {
    this.cls.set(CLS_ID, id);
  }

  public getContextId(): string | '' {
    return this.cls.getId() || 'default-context-id';
  }

  public set<T>(key: string, value: T): void {
    this.cls.set(key, value);
  }
}
