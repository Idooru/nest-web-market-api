import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";

export class SendMailToClientAboutInquiryResponseDto {
  public inquiryRequester: ClientUserEntity;
  public inquiryRequest: InquiryRequestEntity;
  public inquiryResponse: InquiryResponseEntity;
}
