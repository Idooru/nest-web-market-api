import { UserActivityEntity } from "./../entities/user.activity.entity";
import { PickType } from "@nestjs/mapped-types";
import { UserCommonEntity } from "../entities/user.common.entity";
import { UserEntity } from "../entities/user.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { IntersectionType } from "@nestjs/swagger";

export class ResponseUserCoreDto extends PickType(UserEntity, [
  "id",
] as const) {}

export class ResponseUserCommonDto extends PickType(UserCommonEntity, [
  "realname",
  "birth",
  "gender",
  "phonenumber",
]) {}

export class ResponseUserAuthDto extends PickType(UserAuthEntity, [
  "nickname",
  "email",
  "userType",
] as const) {}

export class ResponseUserActivityDto extends PickType(UserActivityEntity, [
  "howMuchBuy",
  "point",
] as const) {}

export class ResponsePartialOneUserDto extends IntersectionType(
  ResponseUserCoreDto,
  ResponseUserCommonDto,
) {}

export class ResponsePartialTwoUserDto extends IntersectionType(
  ResponseUserAuthDto,
  ResponseUserActivityDto,
) {}

export class ResponseUserDto extends IntersectionType(
  ResponsePartialOneUserDto,
  ResponsePartialTwoUserDto,
) {}

export const UserReturnFilter = (user: UserEntity): ResponseUserDto => ({
  id: user.id,
  realname: user.common.realname,
  nickname: user.auth.nickname,
  birth: user.common.birth,
  gender: user.common.gender,
  email: user.auth.email,
  phonenumber: user.common.phonenumber,
  userType: user.auth.userType,
  howMuchBuy: user.activity.howMuchBuy,
  point: user.activity.point,
});
