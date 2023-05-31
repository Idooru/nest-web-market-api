import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class ModifyUserPhonenumberDto extends PickType(UserProfileEntity, [
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
