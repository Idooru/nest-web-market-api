import { PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";

export class LoginUserDto extends PickType(UserAuthEntity, [
  "email",
  "password",
] as const) {}
