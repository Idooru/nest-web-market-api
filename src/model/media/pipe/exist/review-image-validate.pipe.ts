import { Injectable, PipeTransform } from "@nestjs/common";
import { MediaValidator } from "../../logic/media.validator";
import { MediaLoggerLibrary } from "../../../../common/lib/logger/media-logger.library";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ReviewImageValidatePipe implements PipeTransform {
  constructor(
    private readonly mediaValidator: MediaValidator,
    private readonly mediaLoggerLibrary: MediaLoggerLibrary,
  ) {}

  @Implemented
  public transform(reviewImage: Express.Multer.File[]): Express.Multer.File[] {
    const mediaInfo = "리뷰 이미지";

    this.mediaValidator.validate(mediaInfo, reviewImage);
    this.mediaLoggerLibrary.log(mediaInfo, reviewImage);

    return reviewImage;
  }
}
