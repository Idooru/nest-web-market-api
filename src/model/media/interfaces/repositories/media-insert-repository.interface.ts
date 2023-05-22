import { ProductEntity } from "src/model/product/entities/product.entity";
import { ProductImageEntity } from "../../entities/product-image.entity";
import { ReviewImageEntity } from "../../entities/review-image.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ReviewVideoEntity } from "../../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../../entities/inquiry-request-image.entity";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { InquiryResponseImageEntity } from "../../entities/inquiry-response-image.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { InquiryRequestVideoEntity } from "../../entities/inquiry-request-video.entity";
import { InquiryResponseVideoEntity } from "../../entities/inquiry-response-video.entity";

export interface IMediaInsertRepository {
  insertProductIdOnProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void>;
  insertReviewIdOnReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void>;
  insertReviewIdOnReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void>;
  insertInquiryRequestIdOnInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryResponseIdOnInquiryResponseImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryResponseIdOnInquiryResponseVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
}
