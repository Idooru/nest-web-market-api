import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { PostEntity } from "src/common/entities/post.entity";
import { InquiryResponseEntity } from "./inquiry-response.entity";

@Entity({ name: "inquiry_requests", synchronize: true })
export class InquiryRequestEntity extends PostEntity {
  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @ManyToOne(() => ClientUserEntity, (client) => client.writtenInquiryRequest)
  inquiryRequestWritter: ClientUserEntity;

  @IsBoolean()
  @Column({ type: "boolean", default: false })
  isAnswerd: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.InquiryRequest, {
    onDelete: "CASCADE",
  })
  Product: ProductEntity;

  @OneToMany(() => InquiryRequestImageEntity, (image) => image.InquiryRequest, {
    cascade: true,
  })
  Image: InquiryRequestImageEntity[];

  @OneToMany(() => InquiryRequestVideoEntity, (video) => video.InquiryRequest, {
    cascade: true,
  })
  Video: InquiryRequestVideoEntity[];

  @OneToOne(
    () => InquiryResponseEntity,
    (inquiryResponse) => inquiryResponse.InquiryRequest,
    { cascade: true },
  )
  InquiryResponse: InquiryResponseEntity;
}
