import { HttpException, HttpStatus } from "@nestjs/common";
import { TypeORMError } from "typeorm";

export class TypeOrmException extends HttpException {
  constructor(typeOrmError: TypeORMError) {
    super(
      { error: typeOrmError, statusCode: 500 },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
