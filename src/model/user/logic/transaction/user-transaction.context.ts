import { Injectable } from "@nestjs/common";
import { UserService } from "../../services/user.service";
import { RegisterUserDto } from "../../dto/request/register-user.dto";
import { ModifyUserDto } from "../../dto/request/modify-user.dto";

@Injectable()
export class UserTransactionContext {
  constructor(private readonly userService: UserService) {}

  public async registerContext(dto: RegisterUserDto): Promise<void> {
    const user = await this.userService.createUserEntity(dto.role);
    await this.userService.createUserBase(user, dto);
  }

  public async modifyUserContext(dto: ModifyUserDto): Promise<void> {
    await this.userService.modifyUser(dto);
  }
}
