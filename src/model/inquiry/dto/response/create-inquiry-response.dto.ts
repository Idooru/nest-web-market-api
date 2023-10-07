import { InquiryResponseBodyDto } from "./inquiry-response-body.dto";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

class InquiryResponseBasicDto {
  inquiryResponseBodyDto: InquiryResponseBodyDto;
  inquiryRequestId: string;
  inquiryRequesterId: string;
  inquiryResponserId: string;
}

export class CreateInquiryResponseAllMediaDto extends InquiryResponseBasicDto {
  inquiryResponseImgCookies: MediaCookieDto[];
  inquiryResponseVdoCookies: MediaCookieDto[];
}

export class CreateInquiryResponseWithImageDto extends InquiryResponseBasicDto {
  inquiryResponseImgCookies: MediaCookieDto[];
}

export class CreateInquiryResponseWithVideoDto extends InquiryResponseBasicDto {
  inquiryResponseVdoCookies: MediaCookieDto[];
}

export class CreateInquiryResponseNoMediaDto extends InquiryResponseBasicDto {}

export class CreateInquiryResponseDto {
  inquiryResponseBodyDto: InquiryResponseBodyDto;
  admin: AdminUserEntity;
  inquiryRequest: InquiryRequestEntity;
}
