import { Injectable, PipeTransform } from "@nestjs/common";
import { MediaLoggerLibrary } from "../../../../common/lib/logger/media-logger.library";
import { MediaValidator } from "../../logic/media.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ProductImagesValidatePipe implements PipeTransform {
  constructor(
    private readonly mediaValidator: MediaValidator,
    private readonly mediaLoggerLibrary: MediaLoggerLibrary,
  ) {}

  @Implemented
  public transform(
    productImages: Express.Multer.File[],
  ): Express.Multer.File[] {
    const mediaInfo = "상품 이미지";

    this.mediaValidator.validate(mediaInfo, productImages);
    this.mediaLoggerLibrary.log(mediaInfo, productImages);

    return productImages;
  }
}
