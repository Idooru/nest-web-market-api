import { MediaEntity } from "src/common/entities/media.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity({ name: "inquiry_response_videos", synchronize: true })
export class InquiryResponseVideoEntity extends MediaEntity {
  @ManyToOne(
    () => InquiryResponseEntity,
    (inquiryResponse) => inquiryResponse.Video,
    { onDelete: "CASCADE" },
  )
  InquiryResponse: InquiryResponseEntity;
}
