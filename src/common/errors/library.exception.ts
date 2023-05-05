import { HttpException, HttpStatus } from "@nestjs/common";

export class LibraryException extends HttpException {
  constructor(error: Error, libraryName: string) {
    super(
      { error, libraryName, statusCode: 500 },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
