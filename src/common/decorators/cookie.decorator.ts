import { createParamDecorator, ArgumentsHost } from "@nestjs/common";

export const Cookie = createParamDecorator(
  (data: string, context: ArgumentsHost): any => {
    const req = context.switchToHttp().getRequest();

    return req.signedCookies[data] ? req.signedCookies[data] : null;
  },
);
