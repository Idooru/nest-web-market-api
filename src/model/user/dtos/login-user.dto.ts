import { PickType } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class LoginUserDto extends PickType(UserEntity, ["email"] as const) {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}
