import { HttpStatus } from "@nestjs/common";

export class LoginInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: ["access_token", "refresh_token"];
  cookieValue: string[];
}
