import { MediaCookieDto } from "../../dto/media-cookie.dto";
import { InquiryRequestImageEntity } from "../../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../../entities/review-image.entity";
import { ReviewVideoEntity } from "../../entities/review-video.entity";

export interface IMediaAccessoryService {
  isExistMediaFiles(mediaType: string, files: Express.Multer.File[]): void;
  setUrl(mediaFileName: string, path: string): string;
  createMediaCookieValues(
    cookieKey: string,
    files: Express.Multer.File[],
    urls: string[],
  ): MediaCookieDto[];
  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string): void;
  findReviewImages(
    reviewImgCookies: MediaCookieDto[],
  ): Promise<ReviewImageEntity[]>;
  findReviewVideos(
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<ReviewVideoEntity[]>;
  findInquiryRequestImages(
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<InquiryRequestImageEntity[]>;
  findInquiryRequestVideos(
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<InquiryRequestVideoEntity[]>;
  findInquiryResponseImages(
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<InquiryResponseImageEntity[]>;
  findInquiryResponseVideos(
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<InquiryResponseVideoEntity[]>;
}
