import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryRequestImageEntity } from "../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../../media/entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../../media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../../media/entities/inquiry-response-video.entity";

export interface InquiryRepositoryPayload {
  inquiryRequest: Repository<InquiryRequestEntity>;
  inquiryRequestImage: Repository<InquiryRequestImageEntity>;
  inquiryRequestVideo: Repository<InquiryRequestVideoEntity>;
  inquiryResponse: Repository<InquiryResponseEntity>;
  inquiryResponseImage: Repository<InquiryResponseImageEntity>;
  inquiryResponseVideo: Repository<InquiryResponseVideoEntity>;
}
