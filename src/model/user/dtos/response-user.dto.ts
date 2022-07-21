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
  realname: user.Profile.realname,
  nickname: user.Auth.nickname,
  birth: user.Profile.birth,
  gender: user.Profile.gender,
  email: user.Auth.email,
  phonenumber: user.Profile.phonenumber,
  userType: user.Auth.userType,
  purchaseCount: user.Activity.purchaseCount,
  bonusPoint: user.Activity.bonusPoint,
  productInquiryCount: user.Activity.productInquiryCount,
  productReviewCount: user.Activity.productReviewCount,
});
