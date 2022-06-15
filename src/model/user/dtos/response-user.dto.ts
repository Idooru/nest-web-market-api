import { PickType } from "@nestjs/mapped-types";
import { UserEntity } from "../entities/user.entity";

export class ResponseUserDto extends PickType(UserEntity, [
  "id",
  "name",
  "nickName",
  "birth",
  "gender",
  "email",
  "phoneNumber",
  "userType",
] as const) {}
