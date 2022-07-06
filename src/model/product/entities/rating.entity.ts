import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity("ratings")
export class RatingEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product) => product.rating)
  product: ProductEntity;

  @Column({ type: "float", default: 0.0 })
  OnePoint: number;

  @Column({ type: "float", default: 0.0 })
  TwoPoint: number;

  @Column({ type: "float", default: 0.0 })
  ThreePoint: number;

  @Column({ type: "float", default: 0.0 })
  FourPoint: number;

  @Column({ type: "float", default: 0.0 })
  FivePoint: number;
}
