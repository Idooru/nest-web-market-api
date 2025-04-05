import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestBody } from "./inquiry-request-body";
import { MediaCookieDto } from "../../../../media/dto/request/media-cookie.dto";

export class CreateInquiryRequestDto {
  public body: InquiryRequestBody;
  public userId: string;
  public productId: string;
  public imageCookies: MediaCookieDto[];
  public videoCookies: MediaCookieDto[];
}

export class CreateInquiryRequestRowDto {
  public body: InquiryRequestBody;
  public clientUser: ClientUserEntity;
  public product: ProductEntity;
}
