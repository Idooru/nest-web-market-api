import {
  createParamDecorator,
  ArgumentsHost,
  NotFoundException,
} from "@nestjs/common";

export const Cookies = createParamDecorator(
  (data: string, context: ArgumentsHost): any => {
    const req = context.switchToHttp().getRequest();
    try {
      const result = req.signedCookies[data] ? req.signedCookies[data] : null;
      return result;
    } catch (err) {
      throw new NotFoundException("쿠키가 변조 되었습니다.");
    }
  },
);
