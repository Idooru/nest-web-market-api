import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  secure: false,
  httpOnly: true,
  signed: true,
  expires: new Date(Date.now() + 90000),
};
