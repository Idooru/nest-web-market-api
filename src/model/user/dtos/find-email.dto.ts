import { PickType } from "@nestjs/mapped-types";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class FindEmailDto extends PickType(UserProfileEntity, [
  "realname",
  "phonenumber",
] as const) {}
