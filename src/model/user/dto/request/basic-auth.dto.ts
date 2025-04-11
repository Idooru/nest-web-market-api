import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export class BasicAuthDto extends PickType(UserAuthEntity, ["email", "password"] as const) {
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
