import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestBodyDto } from "./inquiry-request-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";

export class PrepareToCreateInquiryRequestDto {
  public inquiryRequestBodyDto: InquiryRequestBodyDto;
  public userId: string;
  public productId: string;
  public inquiryRequestImgCookies: MediaCookieDto[];
  public inquiryRequestVdoCookies: MediaCookieDto[];
}

export class CreateInquiryRequestDto {
  public inquiryRequestBodyDto: InquiryRequestBodyDto;
  public clientUser: ClientUserEntity;
  public product: ProductEntity;
}
