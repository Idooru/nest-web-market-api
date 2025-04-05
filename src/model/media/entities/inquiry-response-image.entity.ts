import { MediaEntity } from "src/common/entities/media.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: "inquiry_response_images", synchronize: true })
export class InquiryResponseImageEntity extends MediaEntity {
  @ManyToOne(() => InquiryResponseEntity, (inquiryResponse) => inquiryResponse.InquiryResponseImage, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "inquiryResponseId" })
  public InquiryResponse: InquiryResponseEntity;
}
