import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { MediaReturnDto } from "../../model/upload/dto/media-return.dto";

export const GetImagesCookie = createParamDecorator(
  (data, ctx: ArgumentsHost): Array<MediaReturnDto> => {
    const req = ctx.switchToHttp().getRequest();

    delete req.cookies.JWT_COOKIE;

    const { ...images } = req.cookies;
    const imgUrls: Array<MediaReturnDto> = [];

    for (const idx in images) {
      imgUrls.push({ name: idx, url: images[idx] });
    }

    return imgUrls;
  },
);
