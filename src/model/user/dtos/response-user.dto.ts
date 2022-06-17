import { PickType } from "@nestjs/mapped-types";
import { UserEntity } from "../entities/user.entity";

export class ResponseUserDto extends PickType(UserEntity, [
  "id",
  "realName",
  "nickName",
  "birth",
  "gender",
  "email",
  "phoneNumber",
  "userType",
] as const) {}

export const UserReturnFilter = (user: UserEntity): ResponseUserDto => ({
  id: user.id,
  realName: user.realName,
  nickName: user.nickName,
  birth: user.birth,
  gender: user.gender,
  email: user.email,
  phoneNumber: user.phoneNumber,
  userType: user.userType,
});
