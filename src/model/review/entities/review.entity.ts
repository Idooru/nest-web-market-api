import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString, IsEnum, IsNumber } from "class-validator";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";

@Entity({ name: "reviews", synchronize: true })
export class ReviewEntity extends CommonEntity {
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Column({ type: "enum", enum: [1, 2, 3, 4, 5] })
  scoreChosenByClient: 1 | 2 | 3 | 4 | 5;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  reviews: string;

  @IsEnum([0, 1, 2])
  @IsNumber()
  @Column({ type: "enum", enum: [0, 1, 2], default: 2 })
  countForModify: number;

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.writtenReview)
  reviewer: ClientUserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review, {
    onDelete: "CASCADE",
  })
  Product: ProductEntity;

  @OneToMany(() => ReviewImageEntity, (image) => image.Review, {
    cascade: true,
  })
  Image?: ReviewImageEntity[];

  @OneToMany(() => ReviewVideoEntity, (video) => video.Review, {
    cascade: true,
  })
  Video?: ReviewVideoEntity[];
}
