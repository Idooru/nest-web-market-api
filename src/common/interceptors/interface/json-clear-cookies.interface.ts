import { HttpStatus } from "@nestjs/common";

export class JsonClearCookiesInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string[];
}
