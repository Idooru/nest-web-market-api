import { MediaDto } from "../../dto/media.dto";
import { InquiryRequestImageEntity } from "../../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../../entities/review-image.entity";
import { ReviewVideoEntity } from "../../entities/review-video.entity";

export interface IMediaAccessoryService {
  isExistMediaFiles(mediaType: string, files: Express.Multer.File[]): void;
  setUrl(mediaFileName: string, path: string): string;
  createMediaCookieValue(
    cookieKey: string,
    file: Express.Multer.File,
    url: string,
  ): MediaDto;
  createMediaCookieValues(
    cookieKey: string,
    files: Express.Multer.File[],
    urls: string[],
  ): MediaDto[];
  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string): void;
  findReviewImages(reviewImgCookies: MediaDto[]): Promise<ReviewImageEntity[]>;
  findReviewVideos(reviewVdoCookies: MediaDto[]): Promise<ReviewVideoEntity[]>;
  findInquiryRequestImages(
    inquiryRequestImgCookies: MediaDto[],
  ): Promise<InquiryRequestImageEntity[]>;
  findInquiryRequestVideos(
    inquiryRequestVdoCookies: MediaDto[],
  ): Promise<InquiryRequestVideoEntity[]>;
  findInquiryResponseImages(
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<InquiryResponseImageEntity[]>;
  findInquiryResponseVideos(
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<InquiryResponseVideoEntity[]>;
}
