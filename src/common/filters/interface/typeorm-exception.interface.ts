import { HttpStatus } from "aws-sdk/clients/lambda";
import { TypeORMError } from "typeorm";

export interface TypeOrmExceptionType {
  statusCode: HttpStatus;
  error: TypeORMError;
}
