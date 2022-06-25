import { UserCommonEntity } from "../entities/user.common.entity";
import { PickType } from "@nestjs/mapped-types";

export class FindEmailDto extends PickType(UserCommonEntity, [
  "realName",
  "phoneNumber",
] as const) {}
