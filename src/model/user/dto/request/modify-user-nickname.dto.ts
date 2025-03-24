import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export class ModifyUserNicknameDto extends PickType(UserAuthEntity, ["nickName"] as const) {
  @ApiProperty({
    description: "사용자 닉네임",
    example: "Idooru",
    required: true,
    uniqueItems: true,
  })
  public nickName: string;
}
