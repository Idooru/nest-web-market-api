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
    "Image.url",
    "StarRating.averageScore",
    "Review",
    "Inquiry",
  ],
  ProductReturnProperty: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "Image.url",
    "StarRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
    "Review",
    "Inquiry",
  ],
  ProductReturnWithStarRating: [
    "product.id",
    "product.name",
    "product.price",
    "product.origin",
    "product.type",
    "product.description",
    "Image.url",
    "StarRating.averageScore",
    "product.createdAt",
    "product.updatedAt",
    "StarRating.id",
  ],
  UserInformationReturnProperty: [
    "Profile.realname",
    "Auth.nickname",
    "Profile.birth",
    "Profile.gender",
    "Auth.email",
    "Profile.phonenumber",
    "Auth.userType",
    "Activity.purchaseCount",
    "Activity.bonusPoint",
    "Activity.productInquiryCount",
    "Activity.productReviewCount",
  ],
};
