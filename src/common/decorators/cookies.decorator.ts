import { createParamDecorator, ArgumentsHost } from "@nestjs/common";

export const Cookies = createParamDecorator(
  (data: string, context: ArgumentsHost) => {
    const req = context.switchToHttp().getRequest();

    return data ? req.signedCookies[data] : req.signedCookies;
  },
);
