import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserProfileEntity } from "../../entities/user-profile.entity";

export class ModifyUserAddressDto extends PickType(UserProfileEntity, ["address"] as const) {
  @ApiProperty({
    description: "집주소",
    example: "경기도 하남시 신장동 569번지",
    required: true,
    uniqueItems: false,
  })
  public address: string;
}
