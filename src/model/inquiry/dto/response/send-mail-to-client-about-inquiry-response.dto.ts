import { UserEntity } from "src/model/user/entities/user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";

export class SendMailToClientAboutInquiryResponseDto {
  user: UserEntity;
  inquiryRequest: InquiryRequestEntity;
  inquiryResponse: InquiryResponseEntity;
}
