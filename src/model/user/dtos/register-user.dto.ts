import { IntersectionType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { UserProfileEntity } from "../entities/user.profile.entity";

export class RegisterUserProfileDto extends PickType(UserProfileEntity, [
  "realname",
  "birth",
  "gender",
  "phonenumber",
] as const) {}

export class RegisterUserAuthDto extends PickType(UserAuthEntity, [
  "email",
  "nickname",
] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}

export class RegisterUserDto extends IntersectionType(
  RegisterUserProfileDto,
  RegisterUserAuthDto,
) {}
