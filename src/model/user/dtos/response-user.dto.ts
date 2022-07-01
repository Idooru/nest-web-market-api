import { UserActivityEntity } from "./../entities/user.activity.entity";
import { PickType } from "@nestjs/mapped-types";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { UserEntity } from "../entities/user.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { IntersectionType } from "@nestjs/swagger";
import { profile } from "console";

export class ResponseUserCoreDto extends PickType(UserEntity, [
  "id",
] as const) {}

export class ResponseUserProfileDto extends PickType(UserProfileEntity, [
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
  "purchaseCount",
  "bonusPoint",
  "productInquiryCount",
  "productReviewCount",
] as const) {}

export class ResponsePartialOneUserDto extends IntersectionType(
  ResponseUserCoreDto,
  ResponseUserProfileDto,
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
  realname: user.profile.realname,
  nickname: user.auth.nickname,
  birth: user.profile.birth,
  gender: user.profile.gender,
  email: user.auth.email,
  phonenumber: user.profile.phonenumber,
  userType: user.auth.userType,
  purchaseCount: user.activity.purchaseCount,
  bonusPoint: user.activity.bonusPoint,
  productInquiryCount: user.activity.productInquiryCount,
  productReviewCount: user.activity.productReviewCount,
});
