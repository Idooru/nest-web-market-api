import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { UserActivityEntity } from "../../user/entities/user.activity.entity";

@Entity({ name: "reviews", synchronize: true })
export class ReviewEntity extends CommonEntity {
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Column({ type: "enum", enum: [1, 2, 3, 4, 5] })
  userSelectScore: 1 | 2 | 3 | 4 | 5;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  reviews: string;

  @ManyToOne(() => UserActivityEntity, (activity) => activity.Review, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userActivityId" })
  UserActivity: UserActivityEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @OneToMany(() => ReviewImageEntity, (image) => image.Review, {
    cascade: true,
  })
  Image?: ReviewImageEntity[];

  @OneToMany(() => ReviewVideoEntity, (video) => video.Review, {
    cascade: true,
  })
  Video?: ReviewVideoEntity[];

  @Column()
  test: string;
}
