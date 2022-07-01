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

export const UserObjectArray = ["profile", "auth", "activity"];

export const ProductsReturnProperty = [
  "p.name",
  "p.price",
  "p.type",
  "i.url",
  "p.rating",
];

export const ProductReturnProperty = [
  "p.id",
  "p.name",
  "p.price",
  "p.origin",
  "p.type",
  "p.description",
  "i.url",
  "p.rating",
  "p.createdAt",
  "p.updatedAt",
];
