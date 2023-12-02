import { HttpStatus } from "@nestjs/common";

export class RefreshTokenInterface {
  statusCode: HttpStatus;
  message: string;
  cookieKey: "access_token";
  cookieValue: string;
}
