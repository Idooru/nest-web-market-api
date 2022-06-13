import { UserAuthEntity } from "./user.auth.entity";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
} from "class-validator";
import { CommonEntity } from "src/lib/entities/common.entity";
import { Column, Entity } from "typeorm";

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity("users")
export class UserEntity extends CommonEntity {
  @IsString({ message: "문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "varchar", nullable: false })
  name: Name;

  @IsString({ message: "문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "varchar", nullable: false })
  nickName: string;

  @IsDateString({ message: "Date 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "datetime", nullable: false })
  birth: Date;

  @IsEnum({ message: "남성,여성 이외에 성별은 존재하지 않습니다." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "enum", enum: ["male", "female"] })
  gender: string;

  @IsEmail({ message: "email 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @IsString({ message: "문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "공백을 남기지 말아주세요." })
  @Column({ type: "varchar", nullable: false })
  password: string;

  @IsEnum({ message: "일반,스페셜,어드민 이외에 유형은 존재하지 않습니다." })
  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: string;

  @IsBoolean({ message: "boolean 형식으로 작성해주세요" })
  @Column({ type: "boolean", default: false })
  isLogin: boolean;
}
