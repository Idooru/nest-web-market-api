import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsMobilePhone,
} from "class-validator";
import { Column, Entity } from "typeorm";
import { InheritUserCoreEntity } from "src/common/entities/inherit-core-entity";

@Entity("users common")
export class UserCommonEntity extends InheritUserCoreEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  realname: string;

  @IsDateString()
  @IsNotEmpty()
  @Column({ type: "date", nullable: false })
  birth: Date;

  @IsEnum(["male", "female"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["male", "female"] })
  gender: "male" | "female";

  @IsMobilePhone()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 15, unique: true, nullable: false })
  phonenumber: string;
}
