import { InquiryResponseBodyDto } from "./inquiry-response-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class PrepareToCreateInquiryResponseDto {
  public inquiryResponseBodyDto: InquiryResponseBodyDto;
  public inquiryRequestId: string;
  public inquiryRequesterId: string;
  public inquiryResponserId: string;
  public inquiryResponseImgCookies: MediaCookieDto[];
  public inquiryResponseVdoCookies: MediaCookieDto[];
}

export class CreateInquiryResponseDto {
  public inquiryResponseBodyDto: InquiryResponseBodyDto;
  public admin: AdminUserEntity;
  public inquiryRequest: InquiryRequestEntity;
}
