import { PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";

export class ModifyUserPasswordDto extends PickType(UserAuthEntity, [
  "password",
] as const) {}
