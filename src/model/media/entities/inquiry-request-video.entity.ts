import { Entity, ManyToOne } from "typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "inquiry_request_videos", synchronize: true })
export class InquiryRequestVideoEntity extends MediaEntity {
  @ManyToOne(
    () => InquiryRequestEntity,
    (inquiryRequest) => inquiryRequest.Image,
    { onDelete: "CASCADE" },
  )
  InquiryRequest: InquiryRequestEntity;
}
