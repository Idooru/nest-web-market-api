import { CommonEntity } from "src/common/entities/common.entity";
import { Entity, OneToOne } from "typeorm";
import { ReviewsImageEntity } from "./review.image.entity";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne()
  ReviewsImage: ReviewsImageEntity;
}
1