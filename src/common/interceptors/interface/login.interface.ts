import { HttpStatus } from "@nestjs/common";

export class LoginInterface {
  statusCode: HttpStatus;
  message: string;
  accessToken: string;
}
