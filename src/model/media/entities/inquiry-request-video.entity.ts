import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "inquiry_request_videos", synchronize: true })
export class InquiryRequestVideoEntity extends MediaEntity {
  @ManyToOne(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.InquiryRequestVideo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "inquiryRequestId" })
  public InquiryRequest: InquiryRequestEntity;
}
