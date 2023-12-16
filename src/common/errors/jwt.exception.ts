import { HttpException } from "@nestjs/common";
import { JwtError } from "./jwt.error";

export class JwtException extends HttpException {
  private readonly __error: JwtError;

  constructor(error: JwtError) {
    super({ error }, error.status);
    this.__error = error;
  }

  public get error() {
    return this.__error;
  }
}
