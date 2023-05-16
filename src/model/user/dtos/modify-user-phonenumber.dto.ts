import { PickType } from "@nestjs/swagger";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class ModifyUserPhonenumberDto extends PickType(UserProfileEntity, [
  "phonenumber",
] as const) {}
