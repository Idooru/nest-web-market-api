import { Injectable, PipeTransform } from "@nestjs/common";
import { MediaValidator } from "../../logic/media.validator";
import { MediaLoggerLibrary } from "../../../../common/lib/logger/media-logger.library";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ReviewVideoValidatePipe implements PipeTransform {
  constructor(
    private readonly mediaValidator: MediaValidator,
    private readonly mediaLoggerLibrary: MediaLoggerLibrary,
  ) {}

  @Implemented
  public transform(reviewVideo: Express.Multer.File[]): Express.Multer.File[] {
    const mediaInfo = "리뷰 비디오";

    this.mediaValidator.validate(mediaInfo, reviewVideo);
    this.mediaLoggerLibrary.log(mediaInfo, reviewVideo);

    return reviewVideo;
  }
}
