import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { Request } from "express";
import { MediaCookie, MediaCookies } from "../types/media-cookies";
import { filtering } from "./filtering";

export const MediaCookiesParser = createParamDecorator(
  (data: string, context: ArgumentsHost): Array<MediaCookie> => {
    const req = context.switchToHttp().getRequest() as Request;

    filtering(req, data);

    return Object.entries(req.signedCookies)
      .filter((mediaCookie: MediaCookies) => mediaCookie[0].includes(data))
      .map((mediaCookie: MediaCookies) => ({
        whatCookie: mediaCookie[0],
        url: mediaCookie[1].url,
        fileName: mediaCookie[1].fileName,
      }));
  },
);
