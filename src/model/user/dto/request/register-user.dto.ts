import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { UserProfileEntity } from "../../entities/user-profile.entity";
import { UserGender } from "../../types/user-gender.type";
import { UserAuthEntity } from "../../entities/user-auth.entity";
import { UserEntity } from "../../entities/user.entity";

export class RegisterUserProfileDto extends PickType(UserProfileEntity, [
  "realName",
  "birth",
  "gender",
  "phoneNumber",
  "address",
] as const) {
  @ApiProperty({
    description: "사용자 본인 이름(실명)",
    example: "홍길동",
    required: true,
    uniqueItems: false,
  })
  public realName: string;

  @ApiProperty({
    description: "사용자 생일",
    type: Date,
    example: "2000-01-01",
    required: true,
    uniqueItems: false,
  })
  public birth: Date;

  @ApiProperty({
    description: "사용자 성별",
    example: "male",
    required: true,
    uniqueItems: false,
  })
  public gender: UserGender;

  @ApiProperty({
    description: "사용자 전화번호",
    example: "010-1234-5678",
    required: true,
    uniqueItems: true,
  })
  public phoneNumber: string;

  @ApiProperty({
    description: "사용자 주소",
    example: "경기도 하남시 미사동 스카이폴리스",
    required: true,
    uniqueItems: false,
  })
  public address: string;
}

export class CreateUserProfileDto extends PickType(UserProfileEntity, [
  "id",
  "realName",
  "birth",
  "gender",
  "phoneNumber",
  "address",
] as const) {}

export class RegisterUserAuthDto extends PickType(UserAuthEntity, ["nickName"] as const) {
  @ApiProperty({
    description: "사용자 닉네임",
    example: "gdhong",
    required: true,
    uniqueItems: true,
  })
  public nickName: string;

  @ApiProperty({
    description: "사용자 이메일",
    example: "email1234@gmail.com",
    required: true,
    uniqueItems: true,
  })
  public email: string;

  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password1234",
    required: true,
    uniqueItems: false,
  })
  public password: string;
}

export class CreateUserAuthDto extends PickType(UserAuthEntity, ["id", "email", "nickName", "password"]) {}

export class RegisterUserRoleDto extends PickType(UserEntity, ["role"]) {}

export class RegisterUserDto extends IntersectionType(
  RegisterUserProfileDto,
  RegisterUserAuthDto,
  RegisterUserRoleDto,
) {}
