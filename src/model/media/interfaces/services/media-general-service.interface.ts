import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { InquiryRequestImageEntity } from "../../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../entities/inquiry-response-video.entity";
import { ProductImageEntity } from "../../entities/product-image.entity";
import { ReviewImageEntity } from "../../entities/review-image.entity";
import { ReviewVideoEntity } from "../../entities/review-video.entity";
import { MediaDto } from "../../dto/media.dto";

export interface IMediaGeneralService {
  findUploadedProductImage(
    email: string,
    url: string,
  ): Promise<ProductImageEntity>;
  findUploadedReviewImages(
    email: string,
    reviewImages: ReviewImageEntity[],
  ): Promise<ReviewImageEntity[]>;
  findUploadedReviewVideos(
    email: string,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<ReviewVideoEntity[]>;
  findUploadedInquiryRequestImages(
    email: string,
    inquiryReqeustImages: InquiryRequestImageEntity[],
  ): Promise<InquiryRequestImageEntity[]>;
  findUploadedInquiryRequestVideos(
    email: string,
    inquiryReqeustVideos: InquiryRequestVideoEntity[],
  ): Promise<InquiryRequestImageEntity[]>;
  findUploadedInquiryResponseImages(
    email: string,
    inquiryResponseImages: InquiryResponseImageEntity[],
  ): Promise<InquiryResponseImageEntity[]>;
  findUploadedInquiryResponseVideos(
    email: string,
    inquiryResponseVideos: InquiryResponseVideoEntity[],
  ): Promise<InquiryResponseVideoEntity[]>;
  uploadProductImage(
    jwtPayload: JwtAccessTokenPayload,
    url: string,
  ): Promise<void>;
  uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  uploadReviewVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  uploadInquiryRequestImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  uploadInquiryRequestVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  uploadInquiryResponseImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  uploadInquiryResponseVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void>;
  deleteProductImageWithCookies(imageCookie: MediaDto): Promise<void>;
  deleteReviewImagesWithCookies(reviewImgCookies: MediaDto[]): Promise<void>;
  deleteReviewVideosWithCookies(reviewVdoCookies: MediaDto[]): Promise<void>;
  deleteInquiryRequestImagesWithCookies(
    inquiryRequestImgCookies: MediaDto[],
  ): Promise<void>;
  deleteInquiryRequestVideosWithCookies(
    inquiryRequestVdoCookies: MediaDto[],
  ): Promise<void>;
  deleteInquiryResponseImagesWithCookies(
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<void>;
  deleteInquiryResponseVideosWithCookies(
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<void>;
}
