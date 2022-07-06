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

export const ProductsReturnProperty = [
  "product.name",
  "product.price",
  "product.type",
  "image.url",
  "product.starRatingPoint",
];

export const ProductReturnProperty = [
  "product.id",
  "product.name",
  "product.price",
  "product.origin",
  "product.type",
  "product.description",
  "image.url",
  "product.starRatingPoint",
  "product.createdAt",
  "product.updatedAt",
];

export const UserReturnProperty = [
  "user.profile",
  "user.auth",
  "user.activity",
];

export const UserInformationReturnProperty = [
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
];
