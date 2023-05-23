import { HttpException } from "@nestjs/common";
import { JsonWebTokenError } from "jsonwebtoken";

export class JwtServiceException extends HttpException {
  constructor(info: string, error: JsonWebTokenError) {
    super({ info, error }, 403);
  }
}
