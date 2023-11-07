import { Inject, Injectable } from "@nestjs/common";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";

@Injectable()
export class MediaEventMapSetter {
  constructor(
    @Inject("MediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
  ) {}

  public setDeleteMediaFilesEventParam(
    event: string,
    deleteMediaFilesDto: DeleteMediaFilesDto,
  ): void {
    this.mediaEventMap.set(event, deleteMediaFilesDto);
  }

  // public setDeleteReviewImageEventParam(
  //   deleteMediaFilesDto: DeleteMediaFilesDto,
  // ): void {
  //   this.mediaEventMap.set("delete-review-image", deleteMediaFilesDto);
  // }
  //
  // public setDeleteReviewVideoEventParam(): void {
  //   this.mediaEventMap.set("delete review video cookies", reviewVdoCookies);
  //   this.mediaEventMap.set("delete review video prefix", prefix);
  // }
  //
  // public setDeleteInquiryRequestImageEventParam(
  //   inquiryRequestImgCookies: MediaCookieDto[],
  //   prefix: string,
  // ): void {
  //   this.mediaEventMap.set(
  //     "delete inquiry request image cookies",
  //     inquiryRequestImgCookies,
  //   );
  //   this.mediaEventMap.set("delete inquiry request image prefix", prefix);
  // }
  //
  // public setDeleteInquiryRequestVideoEventParam(
  //   inquiryRequestVdoCookies: MediaCookieDto[],
  //   prefix: string,
  // ): void {
  //   this.mediaEventMap.set(
  //     "delete inquiry request video cookies",
  //     inquiryRequestVdoCookies,
  //   );
  //   this.mediaEventMap.set("delete inquiry request video prefix", prefix);
  // }
  //
  // public setDeleteProductImageEventParam(
  //   productImgCookies: MediaCookieDto[],
  //   prefix: string,
  // ): void {
  //   this.mediaEventMap.set("delete product image cookies", productImgCookies);
  //   this.mediaEventMap.set("delete product image prefix", prefix);
  // }
  //
  // public setDeleteInquiryResponseImageEventParam(
  //   inquiryResponseImgCookies: MediaCookieDto[],
  //   prefix: string,
  // ): void {
  //   this.mediaEventMap.set(
  //     "delete inquiry response image cookies",
  //     inquiryResponseImgCookies,
  //   );
  //   this.mediaEventMap.set("delete inquiry response image prefix", prefix);
  // }
  //
  // public setDeleteInquiryResponseVideoEventParam(
  //   inquiryResponseVdoCookies: MediaCookieDto[],
  //   prefix: string,
  // ): void {
  //   this.mediaEventMap.set(
  //     "delete inquiry response video cookies",
  //     inquiryResponseVdoCookies,
  //   );
  //   this.mediaEventMap.set("delete inquiry response video prefix", prefix);
  // }
}
