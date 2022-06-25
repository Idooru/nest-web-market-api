import { PickType } from "@nestjs/mapped-types";
import { UserCommonEntity } from "../entities/user.common.entity";
import { UserCoreEntity } from "../entities/user.core.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { IntersectionType } from "@nestjs/swagger";

export class ResponseUserCoreDto extends PickType(UserCoreEntity, [
  "id",
] as const) {}

export class ResponseUserCommonDto extends PickType(UserCommonEntity, [
  "realName",
  "birth",
  "gender",
  "phoneNumber",
]) {}

export class ResponseUserAuthDto extends PickType(UserAuthEntity, [
  "nickName",
  "email",
  "userType",
] as const) {}

export class ResponsePartialUserDto extends IntersectionType(
  ResponseUserCoreDto,
  ResponseUserCommonDto,
) {}

export class ResponseUserDto extends IntersectionType(
  ResponsePartialUserDto,
  ResponseUserAuthDto,
) {}

export const UserReturnFilter = (user: UserCoreEntity): ResponseUserDto => ({
  id: user.id,
  realName: user.common.realName,
  nickName: user.auth.nickName,
  birth: user.common.birth,
  gender: user.common.gender,
  email: user.auth.email,
  phoneNumber: user.common.phoneNumber,
  userType: user.auth.userType,
});
