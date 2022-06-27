import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";
import { UserEntity } from "src/model/user/entities/user.entity";
import { UserCommonEntity } from "src/model/user/entities/user.common.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";

export const CookieOption: CookieOptions = {
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 100000000000),
};

export const JwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
};

export const ProductImageCookieKey = "imageUrl";

export const UserObjectArray = ["common", "auth", "activity"];
