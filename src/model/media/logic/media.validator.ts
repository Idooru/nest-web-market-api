import { BadRequestException, Injectable } from "@nestjs/common";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class MediaValidator {
  public validate(mediaInfo: string, files: Express.Multer.File[]): void {
    if (!files || !files.length) {
      const message = `${mediaInfo}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`;
      loggerFactory("").error(message);
      throw new BadRequestException(message);
    }
  }
}
