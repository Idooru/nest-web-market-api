import { JsonWebTokenError } from "jsonwebtoken";

export interface JwtServiceExceptionType {
  info: string;
  error: JsonWebTokenError;
}
