import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestBodyDto } from "./inquiry-request-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";

class InquiryRequestBasicDto {
  inquiryRequestBodyDto: InquiryRequestBodyDto;
  userId: string;
  productId: string;
}

export class CreateInquiryRequestAllMediaDto extends InquiryRequestBasicDto {
  inquiryRequestImgCookies: MediaCookieDto[];
  inquiryRequestVdoCookies: MediaCookieDto[];
}

export class CreateInquiryRequestWithImageDto extends InquiryRequestBasicDto {
  inquiryRequestImgCookies: MediaCookieDto[];
}

export class CreateInquiryRequestWithVideoDto extends InquiryRequestBasicDto {
  inquiryRequestVdoCookies: MediaCookieDto[];
}

export class CreateInquiryRequestNoMediaDto extends InquiryRequestBasicDto {}

export class CreateInquiryRequestDto {
  inquiryRequestBodyDto: InquiryRequestBodyDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
