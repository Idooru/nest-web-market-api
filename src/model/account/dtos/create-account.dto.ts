import { AccountBodyDto } from "./account-body.dto";
import { UserEntity } from "../../user/entities/user.entity";

export class CreateAccountDto {
  public accountBodyDto: AccountBodyDto;
  public user: UserEntity;
  public isFirst: boolean;
}
