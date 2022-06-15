import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { UserEntity } from "../entities/user.entity";

export class RegisterUserDto extends PickType(UserEntity, [
  "realName",
  "nickName",
  "birth",
  "gender",
  "email",
  "phoneNumber",
] as const) {
  @IsString({ message: "password : 문자열 형식으로 작성해주세요." })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @IsNotEmpty({ message: "password : 공백을 남기지 말아주세요." })
  password: string;
}
