import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { InquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";

@Entity({ name: "inquiries", synchronize: true })
export class InquiryEntity extends CommonEntity {
  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  inquiries: string;

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
