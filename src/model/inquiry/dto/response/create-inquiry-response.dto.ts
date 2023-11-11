import { InquiryResponseBodyDto } from "./inquiry-response-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class PrepareToCreateInquiryResponseDto {
  inquiryResponseBodyDto: InquiryResponseBodyDto;
  inquiryRequestId: string;
  inquiryRequesterId: string;
  inquiryResponserId: string;
  inquiryResponseImgCookies: MediaCookieDto[];
  inquiryResponseVdoCookies: MediaCookieDto[];
}

export class CreateInquiryResponseDto {
  inquiryResponseBodyDto: InquiryResponseBodyDto;
  admin: AdminUserEntity;
  inquiryRequest: InquiryRequestEntity;
}
