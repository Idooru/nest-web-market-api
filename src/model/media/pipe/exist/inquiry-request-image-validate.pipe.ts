import { Injectable, PipeTransform } from "@nestjs/common";
import { MediaValidator } from "../../logic/media.validator";
import { MediaLoggerLibrary } from "../../../../common/lib/logger/media-logger.library";

@Injectable()
export class InquiryRequestImageValidatePipe implements PipeTransform {
  constructor(
    private readonly mediaValidator: MediaValidator,
    private readonly mediaLoggerLibrary: MediaLoggerLibrary,
  ) {}

  public transform(
    inquiryRequestImage: Express.Multer.File[],
  ): Express.Multer.File[] {
    const mediaInfo = "문의 요청 이미지";

    this.mediaValidator.validate(mediaInfo, inquiryRequestImage);
    this.mediaLoggerLibrary.log(mediaInfo, inquiryRequestImage);

    return inquiryRequestImage;
  }
}
