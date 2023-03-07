import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { Request } from "express";
import { filtering } from "./filtering";

export const Cookies = createParamDecorator(
  (data: string, context: ArgumentsHost): Array<unknown> => {
    const req = context.switchToHttp().getRequest() as Request;

    filtering(req, data);

    return Object.entries(req.signedCookies)
      .filter((cookie) => cookie[0].includes(data))
      .map((cookie) => cookie[1]);
  },
);
