import { ProductsEntity } from "src/model/product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";

@Entity("star_ratings")
export class StarRatingEntity extends CommonEntity {
  @OneToOne(() => ProductsEntity, (product) => product.StarRating)
  @JoinColumn({ name: "productId" })
  Product: ProductsEntity;

  @Column({ type: "float", default: 0 })
  averageScore: number;

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
