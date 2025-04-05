import { InquiryResponseBody } from "./inquiry-response-body.dto";
import { AdminUserEntity } from "../../../../user/entities/admin-user.entity";
import { InquiryRequestEntity } from "../../../entities/inquiry-request.entity";
import { MediaCookieDto } from "../../../../media/dto/request/media-cookie.dto";

export class CreateInquiryResponseDto {
  public body: InquiryResponseBody;
  public inquiryRequestId: string;
  public inquiryRequesterId: string;
  public inquiryRespondentId: string;
  public imageCookies: MediaCookieDto[];
  public videoCookies: MediaCookieDto[];
}

export class CreateInquiryResponseRowDto {
  public body: InquiryResponseBody;
  public adminUser: AdminUserEntity;
  public inquiryRequest: InquiryRequestEntity;
}
