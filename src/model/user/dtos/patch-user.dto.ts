import { UserAuthEntity } from "../entities/user.auth.entity";
import { RegisterUserCommonDto } from "./register-user.dto";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { IntersectionType, PickType } from "@nestjs/swagger";

export class PatchUserCommonDto extends RegisterUserCommonDto {}

export class PatchUserAuthDto extends PickType(UserAuthEntity, [
  "nickname",
  "password",
] as const) {}

export class PatchUserDto extends IntersectionType(
  PatchUserCommonDto,
  PatchUserAuthDto,
) {}
