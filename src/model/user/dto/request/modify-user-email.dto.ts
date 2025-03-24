import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export class ModifyUserEmailDto extends PickType(UserAuthEntity, ["email"] as const) {
  @ApiProperty({
    description: "사용자 이메일",
    example: "email1234@gmail.com",
    required: true,
    uniqueItems: true,
  })
  public email: string;
}
