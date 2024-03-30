import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class FindEmailDto extends PickType(UserProfileEntity, [
  "realname",
  "phonenumber",
] as const) {
  @ApiProperty({
    description: "사용자 실명",
    example: "홍길동",
    required: true,
    uniqueItems: false,
  })
  realname: string;

  @ApiProperty({
    description: "사용자 전화번호",
    example: "010-1234-5678",
    required: true,
    uniqueItems: true,
  })
  phonenumber: string;
}
