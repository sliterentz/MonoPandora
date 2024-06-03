export const ContextStorageInterfaceKey = Symbol();

export default interface ContextStorageInterface {
  setContextId(contextId: string): void;
  getContextId(): string;
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
}
