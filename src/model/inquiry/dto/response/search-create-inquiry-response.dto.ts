import { InquiryResponseBodyDto } from "./inquiry-response-body.dto";
import { InquiryResponseImageEntity } from "../../../media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../../media/entities/inquiry-response-video.entity";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class SearchCreateInquiryResponseDto {
  public inquiryResponseBodyDto: InquiryResponseBodyDto;
  public inquiryResponseImages: InquiryResponseImageEntity[];
  public inquiryResponseVideos: InquiryResponseVideoEntity[];
  public inquiryRequester: ClientUserEntity;
  public inquiryResponser: AdminUserEntity;
  public inquiryRequest: InquiryRequestEntity;
}
