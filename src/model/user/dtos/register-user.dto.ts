import { UserCommonEntity } from "./../entities/user.common.entity";
import { PickType } from "@nestjs/mapped-types";
import { IntersectionType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { UserAuthEntity } from "../entities/user.auth.entity";

export class RegisterUserCommonDto extends PickType(UserCommonEntity, [
  "realName",
  "birth",
  "gender",
  "phoneNumber",
] as const) {}

export class RegisterUserAuthDto extends PickType(UserAuthEntity, [
  "email",
  "nickName",
] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}

export class RegisterUserDto extends IntersectionType(
  RegisterUserCommonDto,
  RegisterUserAuthDto,
) {}
