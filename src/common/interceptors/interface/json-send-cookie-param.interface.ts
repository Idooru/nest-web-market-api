import { HttpStatus } from "@nestjs/common";

export class JsonSendCookieParam {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string;
  cookieValue: unknown;
}
