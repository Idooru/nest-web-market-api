import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";

export class CreateUserBaseDto {
  Profile: UserProfileEntity;
  Auth: UserAuthEntity;
  type: ["client", "admin"];
}
