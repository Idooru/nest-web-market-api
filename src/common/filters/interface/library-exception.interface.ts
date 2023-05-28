import { HttpStatus } from "@nestjs/common";

export interface LibraryExceptionType {
  statusCode: HttpStatus;
  libraryName: string;
  error: Error;
}
