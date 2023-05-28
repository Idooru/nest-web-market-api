import { HttpStatus } from "@nestjs/common";

export interface HttpExceptionType {
  statusCode: HttpStatus;
  message: Array<string>;
  error: string;
}
