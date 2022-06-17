import { createParamDecorator } from "@nestjs/common";
import { ArgumentsHost } from "@nestjs/common";

export const getDecodedJwt = createParamDecorator(
  (data, context: ArgumentsHost) => {
    const req = context.switchToHttp().getRequest();

    return req.user;
  },
);
