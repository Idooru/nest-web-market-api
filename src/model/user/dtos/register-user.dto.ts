import { PickType } from "@nestjs/mapped-types";
import { UserEntity } from "../entities/user.entity";

export class RegisterUserDto extends PickType(UserEntity, [
  "name",
  "nickName",
  "birth",
  "gender",
  "email",
  "password",
] as const) {}
