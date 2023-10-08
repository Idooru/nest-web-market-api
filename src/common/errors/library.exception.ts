import { HttpException, HttpStatus } from "@nestjs/common";
import { LibraryError } from "./library.error";

export class LibraryException extends HttpException {
  private readonly _error: LibraryError;

  constructor(error: LibraryError) {
    super({ error, statusCode: 500 }, HttpStatus.INTERNAL_SERVER_ERROR);
    this._error = error;
  }

  public get error() {
    return this._error;
  }
}
