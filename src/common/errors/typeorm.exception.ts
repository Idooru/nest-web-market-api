import { HttpException, HttpStatus } from "@nestjs/common";
import { TypeORMError } from "typeorm";

export class TypeOrmException extends HttpException {
  private readonly _error: TypeORMError;

  constructor(error: TypeORMError) {
    super({ error, statusCode: 500 }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public get error() {
    return this._error;
  }
}
