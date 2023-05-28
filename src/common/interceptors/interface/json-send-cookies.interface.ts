import { HttpStatus } from "@nestjs/common";

export class JsonSendCookiesInterface<T> {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string;
  cookieValues: T[];
}
