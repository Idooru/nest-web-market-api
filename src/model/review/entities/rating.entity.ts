import { ProductEntity } from "src/model/product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity("ratings")
export class RatingEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product) => product.rating)
  product: ProductEntity;

  @Column({ type: "int", default: 0 })
  onePointSum: number;

  @Column({ type: "int", default: 0 })
  onePointCount: number;

  @Column({ type: "int", default: 0 })
  twoPointSum: number;

  @Column({ type: "int", default: 0 })
  twoPointCount: number;

  @Column({ type: "int", default: 0 })
  threePointSum: number;

  @Column({ type: "int", default: 0 })
  threePointCount: number;

  @Column({ type: "int", default: 0 })
  fourPointSum: number;

  @Column({ type: "int", default: 0 })
  fourPointCount: number;

  @Column({ type: "int", default: 0 })
  fivePointSum: number;

  @Column({ type: "int", default: 0 })
  fivePointCount: number;
}
