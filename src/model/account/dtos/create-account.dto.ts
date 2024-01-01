import { AccountBodyDto } from "./account-body.dto";
import { UserEntity } from "../../user/entities/user.entity";

export class CreateAccountDto {
  accountBodyDto: AccountBodyDto;
  user: UserEntity;
  isFirst: boolean;
}
