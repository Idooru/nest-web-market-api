import { ArgumentsHost, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { MediaCookie } from "../types/media-cookies";
import { cookieFilter } from "./cookie-filter";

export const MediaCookieParser = createParamDecorator(
  (data: string, context: ArgumentsHost): MediaCookie => {
    const req = context.switchToHttp().getRequest() as Request;

    cookieFilter(req, data);

    return {
      whatCookie: req.signedCookies[data].whatCookie,
      url: req.signedCookies[data].url,
      fileName: req.signedCookies[data].fileName,
    };
  },
);
