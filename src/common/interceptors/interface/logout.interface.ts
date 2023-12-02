import { HttpStatus } from "@nestjs/common";

export class LogoutInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: ["access_token", "refresh_token"];
}
