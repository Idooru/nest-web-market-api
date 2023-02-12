import { RegisterUserProfileDto } from "./register-user.dto";
import { IntersectionType, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user.auth.entity";

export class PatchUserProfileDto extends RegisterUserProfileDto {}

export class PatchUserAuthDto extends PickType(UserAuthEntity, [
  "email",
  "nickname",
  "password",
] as const) {}

export class PatchUserDto extends IntersectionType(
  PatchUserProfileDto,
  PatchUserAuthDto,
) {}
