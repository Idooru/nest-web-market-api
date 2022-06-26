import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";

export const CookieOption: CookieOptions = {
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 100000000000),
};

export const JwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
};

export const ProductImageCookieKey = "imageUrl";

export const UserObjects: string[] = ["common", "auth", "activity"];
