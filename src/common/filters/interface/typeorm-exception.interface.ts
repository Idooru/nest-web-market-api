import { TypeORMError } from "typeorm";

export interface TypeOrmExceptionType {
  statusCode: number;
  error: TypeORMError;
}
