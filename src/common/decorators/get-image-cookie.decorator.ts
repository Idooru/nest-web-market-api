import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { ImageGetDto } from "src/model/upload/dto/image-get.dto";

export const GetImageCookie = createParamDecorator(
  (data, ctx: ArgumentsHost): ImageGetDto => {
    const req = ctx.switchToHttp().getRequest();
    const cookies = req.signedCookies;
    const imageKey = Object.keys(cookies).find((idx) =>
      idx.includes("imageUrl"),
    );
    const imageValue: string = cookies[imageKey];

    return { [imageKey]: imageValue };
  },
);
