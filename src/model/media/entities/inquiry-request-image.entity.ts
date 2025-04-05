import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "inquiry_request_images", synchronize: true })
export class InquiryRequestImageEntity extends MediaEntity {
  @ManyToOne(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.InquiryRequestImage, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "inquiryRequestId" })
  public InquiryRequest: InquiryRequestEntity;
}
