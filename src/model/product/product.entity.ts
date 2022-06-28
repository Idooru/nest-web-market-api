import { ImagesEntity } from "./../upload/entities/upload.entity";
import { float } from "aws-sdk/clients/lightsail";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity("products")
export class ProductEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  price: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  type: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", default: 50 })
  quantity: number;

  @Column({ type: "float", default: 0.0 })
  rating: float;

  @OneToOne(() => ImagesEntity, (image) => image.product)
  @JoinColumn({ name: "imageId" })
  image?: ImagesEntity;

  // @Column({ type: "varchar", length: 20 })
  // imgUrl?: string;
}
