import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export const CookieOption: CookieOptions = {
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 100000000000),
};

export const JwtOptions: JwtModuleOptions = {
  secret: new ConfigService().get("JWT_SECRET"),
};

export const ReturnPropertyWithSelect = {
  ProductsReturnProperty: [
    "product.name",
    "product.price",
    "product.type",
    "image.url",
    "starRating.averageScore",
  ],
  ProductReturnProperty: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "image.url",
    "starRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
  ],
  ProductReturnWithStarRating: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "image.url",
    "starRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
    "starRating.id",
  ],
  UserInformationReturnProperty: [
    "profile.realname",
    "auth.nickname",
    "profile.birth",
    "profile.gender",
    "auth.email",
    "profile.phonenumber",
    "auth.userType",
    "activity.purchaseCount",
    "activity.bonusPoint",
    "activity.productInquiryCount",
    "activity.productReviewCount",
  ],
};
