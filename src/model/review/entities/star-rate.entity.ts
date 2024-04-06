import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "star_rates", synchronize: true })
export class StarRateEntity extends ChildEntity {
  @OneToOne(() => ProductEntity, (product) => product.StarRate, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public Product: ProductEntity;

  @Column({ type: "float", default: 0 })
  public averageScore: number;

  @Column({ type: "int", default: 0 })
  public onePointSum: number;

  @Column({ type: "int", default: 0 })
  public onePointCount: number;

  @Column({ type: "int", default: 0 })
  public twoPointSum: number;

  @Column({ type: "int", default: 0 })
  public twoPointCount: number;

  @Column({ type: "int", default: 0 })
  public threePointSum: number;

  @Column({ type: "int", default: 0 })
  public threePointCount: number;

  @Column({ type: "int", default: 0 })
  public fourPointSum: number;

  @Column({ type: "int", default: 0 })
  public fourPointCount: number;

  @Column({ type: "int", default: 0 })
  public fivePointSum: number;

  @Column({ type: "int", default: 0 })
  public fivePointCount: number;
}
