import { UserActivityEntity } from "./../entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UserCommonEntity } from "../entities/user.common.entity";

export class CreateUserDto {
  common: UserCommonEntity;
  auth: UserAuthEntity;
  activity: UserActivityEntity;
}
