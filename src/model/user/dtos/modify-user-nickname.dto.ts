import { PickType } from "@nestjs/swagger";
import { UserAuthEntity } from "../entities/user-auth.entity";

export class ModifyUserNicknameDto extends PickType(UserAuthEntity, [
  "nickname",
] as const) {}
