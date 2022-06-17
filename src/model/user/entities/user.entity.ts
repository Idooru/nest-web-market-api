import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity("users")
export class UserEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  realName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "date", nullable: false })
  birth: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["male", "female"] })
  gender: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: "varchar", nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 15, unique: true, nullable: false })
  phoneNumber: string;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: string;
}
