import { Injectable } from "@nestjs/common";
import { UserService } from "../../services/user.service";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { PrepareToModifyUserDto } from "../../dtos/prepare-to-modify-user.dto";

@Injectable()
export class UserTransactionContext {
  constructor(private readonly userService: UserService) {}

  public async registerContext(dto: RegisterUserDto): Promise<void> {
    const user = await this.userService.createUserEntity(dto.role);
    await this.userService.createUserBase(user, dto);
  }

  public async modifyUserContext({ id, modifyUserDto }: PrepareToModifyUserDto): Promise<void> {
    await this.userService.modifyUser(modifyUserDto, id);
  }
}
