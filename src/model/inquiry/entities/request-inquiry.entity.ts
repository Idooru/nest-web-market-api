import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { InquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { PostEntity } from "src/common/entities/post.entity";

@Entity({ name: "request_inquiries", synchronize: true })
export class RequestInquiryEntity extends PostEntity {
  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @ManyToOne(() => ClientUserEntity, (client) => client.writtenInquiry)
  inquirer: ClientUserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Inquiry, {
    onDelete: "CASCADE",
  })
  Product: ProductEntity;

  @OneToMany(() => InquiryImageEntity, (image) => image.Inquiry, {
    cascade: true,
  })
  Image: InquiryImageEntity[];

  @OneToMany(() => InquiryVideoEntity, (video) => video.Inquiry, {
    cascade: true,
  })
  Video: InquiryVideoEntity[];
}
