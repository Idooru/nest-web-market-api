import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { IsEmail, IsJWT, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "users_auth", synchronize: true })
export class UserAuthEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.UserAuth, {
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
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {
    message: "비밀번호 유효성이 어긋납니다. 8자 ~ 30자 사이, 영문 특수 문자 조합을 준수해주세요.",
  })
  @Column({ type: "varchar", nullable: false })
  public password: string;

  @IsJWT()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 500, unique: true, nullable: true })
  public refreshToken: string;
}
