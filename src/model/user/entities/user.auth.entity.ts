import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ImagesEntity } from "./../../upload/entities/upload.entity";
import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "./user.entity";

@Entity("users auth", { synchronize: false })
export class UserAuthEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickname: string;

  @IsEmail()
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

  @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;

  @OneToMany(() => ImagesEntity, (join) => join.uploader, { cascade: true })
  image: ImagesEntity;
}
