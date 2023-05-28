import { HttpStatus } from "@nestjs/common";

export class JsonGeneralInterface<T> {
  statusCode: HttpStatus;
  message: string;
  result?: T;
}
