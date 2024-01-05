import { InquiryRequestBodyDto } from "./inquiry-request-body.dto";
import { ProductEntity } from "../../../product/entities/product.entity";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";
import { InquiryRequestImageEntity } from "../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../../media/entities/inquiry-request-video.entity";

export class SearchCreateInquiryRequestDto {
  inquiryRequestBodyDto: InquiryRequestBodyDto;
  product: ProductEntity;
  clientUser: ClientUserEntity;
  inquiryRequestImages: InquiryRequestImageEntity[];
  inquiryRequestVideos: InquiryRequestVideoEntity[];
}
