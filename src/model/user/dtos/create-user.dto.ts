import { UserActivityEntity } from "./../entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UserProfileEntity } from "../entities/user.profile.entity";

export class CreateUserDto {
  Profile: UserProfileEntity;
  Auth: UserAuthEntity;
  Activity: UserActivityEntity;
}
