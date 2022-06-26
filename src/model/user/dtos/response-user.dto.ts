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
  realName: user.commonId.realName,
  nickName: user.authId.nickName,
  birth: user.commonId.birth,
  gender: user.commonId.gender,
  email: user.authId.email,
  phoneNumber: user.commonId.phoneNumber,
  userType: user.authId.userType,
});
