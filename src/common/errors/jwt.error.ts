import { HttpStatus } from "@nestjs/common";

export class JwtError {
  name: string;
  message: string;
  whatToken: "access_token" | "refresh_token";
  status: HttpStatus;
}
