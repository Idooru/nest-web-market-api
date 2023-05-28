import { HttpStatus } from "@nestjs/common";

export class JsonJwtLogoutInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: ["access_token", "refresh_token"];
}
