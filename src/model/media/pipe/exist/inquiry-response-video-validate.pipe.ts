import { Injectable, PipeTransform } from "@nestjs/common";
import { MediaValidator } from "../../logic/media.validator";
import { MediaLoggerLibrary } from "../../../../common/lib/logger/media-logger.library";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class InquiryResponseVideoValidatePipe implements PipeTransform {
  constructor(
    private readonly mediaValidator: MediaValidator,
    private readonly mediaLoggerLibrary: MediaLoggerLibrary,
  ) {}

  @Implemented
  public transform(
    inquiryResponseImage: Express.Multer.File[],
  ): Express.Multer.File[] {
    const mediaInfo = "문의 응답 비디오";

    this.mediaValidator.validate(mediaInfo, inquiryResponseImage);
    this.mediaLoggerLibrary.log(mediaInfo, inquiryResponseImage);

    return inquiryResponseImage;
  }
}
