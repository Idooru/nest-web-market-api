import { UserProfileEntity } from "../entities/user.profile.entity";
import { PickType } from "@nestjs/mapped-types";

export class FindEmailDto extends PickType(UserProfileEntity, [
  "realname",
  "phonenumber",
] as const) {}
