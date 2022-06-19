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
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}
