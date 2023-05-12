import { UserEntity } from "../../entities/user.entity";

export interface IUserAccessoryService {
  findUserWithEmail(email: string): Promise<UserEntity>;
}
