import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtException } from "../../errors/jwt.exception";
import { JwtError } from "../../errors/jwt.error";

@Injectable()
export class JwtErrorHandlerLibrary {
  public catchSignAccessTokenError(err: JwtError): never {
    throw new JwtException({
      name: err.name,
      message: err.message,
      whatToken: "access_token",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  public catchSignRefreshTokenError(err: JwtError): never {
    throw new JwtException({
      name: err.name,
      message: err.message,
      whatToken: "refresh_token",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  public catchVerifyAccessTokenError(err: JwtError): never {
    throw new JwtException({
      name: err.name,
      message: err.message,
      whatToken: "access_token",
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  public catchVerifyRefreshTokenError(err: JwtError): never {
    throw new JwtException({
      name: err.name,
      message: err.message,
      whatToken: "refresh_token",
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
