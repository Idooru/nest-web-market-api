import { UserEntity } from "../../user/entities/user.entity";
import { AccountBody } from "./account-body.dto";

export class CreateAccountDto {
  public user: UserEntity;
  public body: AccountBody;
}
