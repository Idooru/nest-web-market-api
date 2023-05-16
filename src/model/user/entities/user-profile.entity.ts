import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsMobilePhone,
} from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "users_profile", synchronize: true })
export class UserProfileEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.Profile, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

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
