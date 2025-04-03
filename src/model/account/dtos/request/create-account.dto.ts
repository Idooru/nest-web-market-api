import { AccountBody } from "./account-body.dto";
import { UserEntity } from "../../../user/entities/user.entity";

export class CreateAccountDto {
  public user: UserEntity;
  public body: AccountBody;
}
