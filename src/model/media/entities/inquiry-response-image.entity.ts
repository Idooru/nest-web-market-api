import { MediaEntity } from "src/common/entities/media.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity({ name: "inquiry_response_images", synchronize: true })
export class InquiryResponseImageEntity extends MediaEntity {
  @ManyToOne(
    () => InquiryResponseEntity,
    (inquiryResponse) => inquiryResponse.Image,
    { onDelete: "CASCADE" },
  )
  InquiryResponse: InquiryResponseEntity;
}
