import { IsEnum, IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { RequestInquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { RequestInquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";
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

  @OneToMany(() => RequestInquiryImageEntity, (image) => image.Inquiry, {
    cascade: true,
  })
  Image: RequestInquiryImageEntity[];

  @OneToMany(() => RequestInquiryVideoEntity, (video) => video.Inquiry, {
    cascade: true,
  })
  Video: RequestInquiryVideoEntity[];
}
