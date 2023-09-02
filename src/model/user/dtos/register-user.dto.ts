import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserEntity } from "../entities/user.entity";

export class RegisterUserProfileDto extends PickType(UserProfileEntity, [
  "realname",
  "birth",
  "gender",
  "phonenumber",
] as const) {
  @ApiProperty({
    description: "사용자 본인 이름(실명)",
    example: "홍길동",
    required: true,
    uniqueItems: false,
  })
  realname: string;

  @ApiProperty({
    description: "사용자 생일",
    type: Date,
    example: "2000-01-01",
    required: true,
    uniqueItems: false,
  })
  birth: Date;

  @ApiProperty({
    description: "사용자 성별",
    example: "male",
    required: true,
    uniqueItems: false,
  })
  gender: "male" | "female";

  @ApiProperty({
    description: "사용자 전화번호",
    example: "010-1234-5678",
    required: true,
    uniqueItems: true,
  })
  phonenumber: string;
}

export class CreateUserProfileDto extends PickType(UserProfileEntity, [
  "id",
  "realname",
  "birth",
  "gender",
  "phonenumber",
]) {}

export class RegisterUserAuthDto extends PickType(UserAuthEntity, [
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

export class CreateUserAuthDto extends PickType(UserAuthEntity, [
  "id",
  "email",
  "nickname",
  "password",
]) {}

export class RegisterUserRoleDto extends PickType(UserEntity, ["role"]) {
  @ApiProperty({
    description: "사용자 권한",
    example: "admin",
    required: true,
    uniqueItems: false,
  })
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["client", "admin"], nullable: false })
  role: ["client", "admin"];
}

export class RegisterUserDto extends IntersectionType(
  RegisterUserProfileDto,
  RegisterUserAuthDto,
  RegisterUserRoleDto,
) {}
