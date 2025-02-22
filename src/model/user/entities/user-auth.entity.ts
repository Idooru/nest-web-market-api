import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "users_auth", synchronize: true })
export class UserAuthEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.Auth, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public User: UserEntity;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  public nickName: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, { message: "유효성이 어긋납니다." })
  @Column({ type: "varchar", nullable: false })
  public password: string;
}
