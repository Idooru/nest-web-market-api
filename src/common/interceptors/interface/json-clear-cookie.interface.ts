import { HttpStatus } from "aws-sdk/clients/lambda";

export class JsonClearCookieInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: string;
}
