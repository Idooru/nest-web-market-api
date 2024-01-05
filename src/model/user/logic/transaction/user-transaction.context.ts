import { Injectable } from "@nestjs/common";
import { UserUpdateService } from "../../services/user-update.service";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { PrepareToModifyUserDto } from "../../dtos/prepare-to-modify-user.dto";

@Injectable()
export class UserTransactionContext {
  constructor(private readonly userUpdateService: UserUpdateService) {}

  public registerContext(dto: RegisterUserDto): () => Promise<void> {
    return async () => {
      const user = await this.userUpdateService.createUserEntity(dto.role);

      await this.userUpdateService.createUserBase(user, dto);
    };
  }

  public modifyUserContext(dto: PrepareToModifyUserDto): () => Promise<void> {
    const { id, modifyUserDto } = dto;

    return async () => this.userUpdateService.modifyUser(modifyUserDto, id);
  }
}
