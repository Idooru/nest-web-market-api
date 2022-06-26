import { UserAuthEntity } from "../entities/user.auth.entity";
import { RegisterUserCommonDto } from "./register-user.dto";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { IntersectionType, PickType } from "@nestjs/swagger";

export class PatchUserCommonDto extends RegisterUserCommonDto {}

export class PatchUserAuthDto extends PickType(UserAuthEntity, [
  "nickname",
] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}

export class PatchUserDto extends IntersectionType(
  PatchUserCommonDto,
  PatchUserAuthDto,
) {}
