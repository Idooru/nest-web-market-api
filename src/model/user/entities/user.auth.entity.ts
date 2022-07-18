import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { UsersEntity } from "./user.entity";

@Entity("users_auth")
export class UserAuthEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.Auth)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UsersEntity;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: "general" | "special" | "admin";
}
