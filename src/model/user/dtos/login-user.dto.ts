import { PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class LoginUserDto extends PickType(UserAuthEntity, ["email"] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}
