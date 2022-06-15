import { PickType } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class LoginUserDto extends PickType(UserEntity, ["email"] as const) {
  @IsString({ message: "password : 문자열 형식으로 작성해주세요." })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @IsNotEmpty({ message: "password : 공백을 남기지 말아주세요." })
  password: string;
}
