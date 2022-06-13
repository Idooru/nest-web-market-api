import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { Column } from "typeorm";

export class UserAuthEntity {
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
