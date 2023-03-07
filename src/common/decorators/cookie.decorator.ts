import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { cookieFilter } from "./cookie-filter";

export const Cookie = createParamDecorator(
  (data: string, context: ArgumentsHost): any => {
    const req = context.switchToHttp().getRequest();

    cookieFilter(req, data);

    return req.signedCookies[data];
  },
);
