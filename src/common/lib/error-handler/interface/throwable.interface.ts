export interface Throwable {
  throwException(error: Error): never;
}
