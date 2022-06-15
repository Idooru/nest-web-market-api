import { UserEntity } from "../entities/user.entity";
import { PickType } from "@nestjs/mapped-types";

export class FindEmailDto extends PickType(UserEntity, [
  "phoneNumber",
  "birth",
] as const) {}
