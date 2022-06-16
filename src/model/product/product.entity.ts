import { int } from "aws-sdk/clients/datapipeline";
import { float } from "aws-sdk/clients/lightsail";
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity("products")
export class ProductEntity extends CommonEntity {
  @IsString({ message: "productName: 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "productName: 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", length: 40, unique: true, nullable: false })
  productName: string;

  @IsInt()
  @IsNotEmpty({ message: "price: 공백을 남기지 말아주세요." })
  @Column({ type: "int", unsigned: true, nullable: false })
  price: int;

  @IsString({ message: "origin: 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "origin: 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", length: 20, nullable: false })
  origin: string;

  @IsString({ message: "type: 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "type: 공백을 남기지 말아주세요." })
  @Column({ type: "text", length: 20, nullable: false })
  type: string;

  @IsString({ message: "description: 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "description: 공백을 남기지 말아주세요." })
  @Column({ type: "text", length: 100, nullable: true })
  description: string;

  @Column({ type: "string", default: "no image yet" })
  imgUrl: string;

  @Column({ type: "number", default: 50 })
  quantity: number;

  @Column({ type: "float", default: 0.0 })
  rating: float;
}
