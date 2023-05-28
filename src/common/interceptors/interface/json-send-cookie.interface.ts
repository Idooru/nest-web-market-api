import { HttpStatus } from "@nestjs/common";

export class JsonSendCookieInterface<T> {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string;
  cookieValue: T;
}
