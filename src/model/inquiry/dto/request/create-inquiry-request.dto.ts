import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestBodyDto } from "./inquiry-request-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";

export class PrepareToCreateInquiryRequestDto {
  inquiryRequestBodyDto: InquiryRequestBodyDto;
  userId: string;
  productId: string;
  inquiryRequestImgCookies: MediaCookieDto[];
  inquiryRequestVdoCookies: MediaCookieDto[];
}

export class CreateInquiryRequestDto {
  inquiryRequestBodyDto: InquiryRequestBodyDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
