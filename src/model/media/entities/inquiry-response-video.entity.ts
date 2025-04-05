import { MediaEntity } from "src/common/entities/media.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: "inquiry_response_videos", synchronize: true })
export class InquiryResponseVideoEntity extends MediaEntity {
  @ManyToOne(() => InquiryResponseEntity, (inquiryResponse) => inquiryResponse.InquiryResponseVideo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "inquiryResponseId" })
  public InquiryResponse: InquiryResponseEntity;
}
