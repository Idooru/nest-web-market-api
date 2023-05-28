import { HttpStatus } from "@nestjs/common";

export class JsonSendCookiesParamInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string;
  cookieValues: Array<unknown>;
}
