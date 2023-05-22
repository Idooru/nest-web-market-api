import { UploadMediaDto } from "../../dto/upload-media.dto";
import { InquiryRequestImageEntity } from "../../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../entities/inquiry-response-video.entity";
import { ProductImageEntity } from "../../entities/product-image.entity";
import { ReviewImageEntity } from "../../entities/review-image.entity";
import { ReviewVideoEntity } from "../../entities/review-video.entity";

export interface IMediaGeneralRepository {
  findUploadedProductImage(
    email: string,
    url: string,
  ): Promise<ProductImageEntity>;
  findUploadedReviewImages(
    email: string,
    url: string,
  ): Promise<ReviewImageEntity>;
  findUploadedReviewVideos(
    email: string,
    url: string,
  ): Promise<ReviewVideoEntity>;
  findUploadedInquiryReqeustImages(
    email: string,
    url: string,
  ): Promise<InquiryRequestImageEntity>;
  findUploadedInquiryReqeustVideos(
    email: string,
    url: string,
  ): Promise<InquiryRequestVideoEntity>;
  findUploadedInquiryResponseImages(
    email: string,
    url: string,
  ): Promise<InquiryResponseImageEntity>;
  findUploadedInquiryResponseVideos(
    email: string,
    url: string,
  ): Promise<InquiryResponseVideoEntity>;
  uploadProductImage(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadReviewImage(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadReviewVideo(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadInquiryRequestImage(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadInquiryRequestVideo(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadInquiryResponseImage(uploadMediaDto: UploadMediaDto): Promise<void>;
  uploadInquiryResponseVideo(uploadMediaDto: UploadMediaDto): Promise<void>;
  findProductImageWithUrl(url: string): Promise<ProductImageEntity>;
  findReviewImageWithUrl(url: string): Promise<ReviewImageEntity>;
  findReviewVideoWithUrl(url: string): Promise<ReviewVideoEntity>;
  findInquiryRequestImageWithUrl(
    url: string,
  ): Promise<InquiryRequestImageEntity>;
  findInquiryRequestVideoWithUrl(
    url: string,
  ): Promise<InquiryRequestVideoEntity>;
  findInquiryResponseImageWithUrl(
    url: string,
  ): Promise<InquiryResponseImageEntity>;
  findInquiryResponseVideoWithUrl(
    url: string,
  ): Promise<InquiryResponseVideoEntity>;
  deleteProductImageWithId(id: string): Promise<void>;
  deleteReviewImageWithId(id: string): Promise<void>;
  deleteReviewVideoWithId(id: string): Promise<void>;
  deleteInquiryRequestImageWithId(id: string): Promise<void>;
  deleteInquiryRequestVideoWIthId(id: string): Promise<void>;
  deleteInquiryResponseImageWithId(id: string): Promise<void>;
  deleteInquiryResponseVideoWithId(id: string): Promise<void>;
  findProductImageEvenUseWithId(id: string): Promise<ProductImageEntity>;
  findBeforeReviewImagesWithId(id: string): Promise<ReviewImageEntity[]>;
  findBeforeReviewImageWithId(id: string): Promise<ReviewImageEntity>;
  findBeforeReviewVideosWithId(id: string): Promise<ReviewVideoEntity[]>;
  findBeforeReviewVideoWithId(id: string): Promise<ReviewVideoEntity>;
}
