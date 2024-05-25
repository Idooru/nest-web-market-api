import { Injectable } from "@nestjs/common";
import { UserService } from "../../services/user.service";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { PrepareToModifyUserDto } from "../../dtos/prepare-to-modify-user.dto";

@Injectable()
export class UserTransactionContext {
  constructor(private readonly userService: UserService) {}

  public registerContext(dto: RegisterUserDto): () => Promise<void> {
    return async () => {
      const user = await this.userService.createUserEntity(dto.role);

      await this.userService.createUserBase(user, dto);
    };
  }

  public modifyUserContext(dto: PrepareToModifyUserDto): () => Promise<void> {
    const { id, modifyUserDto } = dto;

    return async () => this.userService.modifyUser(modifyUserDto, id);
  }
}
