import { TypeORMError } from "typeorm";

export interface ErrorHandlerStrategy {
  handle(error: TypeORMError, stuffs: string[], stuffMeans: string[]): void;
}
