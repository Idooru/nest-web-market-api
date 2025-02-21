import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class ModifyUserProfileDto extends PickType(UserProfileEntity, ["phoneNumber", "address"] as const) {
  @ApiProperty({
    description: "사용자 전화번호",
    example: "010-1234-5678",
    required: true,
    uniqueItems: true,
  })
  public phoneNumber: string;

  @ApiProperty({
    description: "사용자 집주소",
    example: "경기도 하남시 신장동 569번지",
    required: true,
    uniqueItems: false,
  })
  public address: string;
}

export class ModifyUserAuthDto extends PickType(UserAuthEntity, ["email", "nickName", "password"] as const) {
  @ApiProperty({
    description: "사용자 닉네임",
    example: "Idooru",
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

export class ModifyUserDto extends IntersectionType(ModifyUserProfileDto, ModifyUserAuthDto) {}
