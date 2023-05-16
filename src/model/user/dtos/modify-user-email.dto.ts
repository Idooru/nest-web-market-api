import { PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";

export class ModifyUserEmailDto extends PickType(UserAuthEntity, [
  "email",
] as const) {}
