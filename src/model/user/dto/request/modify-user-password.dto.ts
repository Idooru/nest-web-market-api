import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export class ModifyUserPasswordDto extends PickType(UserAuthEntity, ["password"] as const) {
  @ApiProperty({
    description: "사용자 비밀번호",
    example: "password1234",
    required: true,
    uniqueItems: false,
  })
  public password: string;
}
