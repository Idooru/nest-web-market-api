import { IntersectionType, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { UserProfileEntity } from "../entities/user.profile.entity";

export class ModifyUserProfileDto extends PickType(UserProfileEntity, [
  "phonenumber",
] as const) {}

export class ModifyUserAuthDto extends PickType(UserAuthEntity, [
  "email",
  "nickname",
  "password",
] as const) {}

export class ModifyUserDto extends IntersectionType(
  ModifyUserProfileDto,
  ModifyUserAuthDto,
) {}
