import { createParamDecorator } from "@nestjs/common";
import { ArgumentsHost } from "@nestjs/common";
import { Request } from "express";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";

export const GetJWT = createParamDecorator(
  (data, context: ArgumentsHost): JwtAccessTokenPayload | JwtRefreshTokenPayload => {
    const req = context.switchToHttp().getRequest<Request>();

    return req.user;
  },
);
