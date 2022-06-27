import { UserEntity } from "./user.core.entity";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { InheritUserEntity } from "src/common/entities/inherit-core-entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity("users auth")
export class UserAuthEntity extends InheritUserEntity {
  @OneToOne(() => UserEntity)
  core: UserEntity;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: "general" | "special" | "admin";
}
