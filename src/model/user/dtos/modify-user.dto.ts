import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class ModifyUserProfileDto extends PickType(UserProfileEntity, [
  "phonenumber",
] as const) {
  @ApiProperty({
    description: "사용자 전화번호",
    example: "010-1234-5678",
    required: true,
    uniqueItems: true,
  })
  phonenumber: string;
}

export class ModifyUserAuthDto extends PickType(UserAuthEntity, [
  "email",
  "nickname",
  "password",
] as const) {
  @ApiProperty({
    description: "사용자 닉네임",
    example: "Idooru",
    required: true,
    uniqueItems: true,
  })
  nickname: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "email1234@gmail.com",
    required: true,
    uniqueItems: true,
  })
  email: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password1234",
    required: true,
    uniqueItems: false,
  })
  password: string;
}

export class ModifyUserDto extends IntersectionType(
  ModifyUserProfileDto,
  ModifyUserAuthDto,
) {}
