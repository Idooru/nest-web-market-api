import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export const cookieOption: CookieOptions = {
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 10000000000),
};

export const jwtOptions: JwtModuleOptions = {
  secret: new ConfigService().get("JWT_SECRET"),
};
