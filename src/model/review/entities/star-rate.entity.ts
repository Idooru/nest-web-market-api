import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "star_rates", synchronize: true })
export class StarRateEntity extends ChildEntity {
  @OneToOne(() => ProductEntity, (product) => product.StarRate, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  Product: ProductEntity;

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
