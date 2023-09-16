import { UserOperationRepository } from "../repositories/user-operation.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

@Injectable()
export class UserOperationService {
  constructor(
    private readonly userOperationRepository: UserOperationRepository,
    private readonly userSearcher: UserSearcher,
    private readonly userSecurity: UserSecurity,
  ) {}

  // Transaction
  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    const user = await this.userOperationRepository.createUserEntity(role);

    if (role.toString() === "admin") {
      await this.userOperationRepository.createAdminUser(user);
    } else {
      await this.userOperationRepository.createClientUser(user);
    }

    return user;
  }

  // Transaction
  async createUserBase(
    user: UserEntity,
    registerUserDto: RegisterUserDto,
  ): Promise<{ email: string; nickname: string }> {
    const { id } = user;
    const { realname, nickname, birth, gender, email, phonenumber, password } =
      registerUserDto;

    const hashed = await this.userSecurity.hashPassword(password);

    const userProfileColumn = { id, realname, birth, gender, phonenumber };
    const userAuthColumn = { id, nickname, email, password: hashed };

    await Promise.all([
      this.userOperationRepository.createUserProfile(userProfileColumn),
      this.userOperationRepository.createUserAuth(userAuthColumn),
    ]);

    return {
      email,
      nickname,
    };
  }

  // Transaction
  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const { password, phonenumber, email, nickname } = modifyUserDto;

    const hashed = await this.userSecurity.hashPassword(password);

    await Promise.all([
      this.userOperationRepository.modifyUserProfile({ phonenumber }, id),
      this.userOperationRepository.modifyUserAuth(
        { email, nickname, password: hashed },
        id,
      ),
    ]);
  }

  // General
  async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userSearcher.isInvalidUserEmail(email);
    await this.userOperationRepository.modifyUserEmail(email, id);
  }

  // General
  async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userSearcher.isInvalidNickName(nickname);
    await this.userOperationRepository.modifyUserNickname(nickname, id);
  }

  // General
  async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userSearcher.isInvalidUserPhoneNumber(phonenumber);
    await this.userOperationRepository.modifyUserPhonenumber(phonenumber, id);
  }

  // General
  async modifyUserPassword(password: string, id: string): Promise<void> {
    const hashed = await this.userSecurity.hashPassword(password);

    await this.userOperationRepository.modifyUserPassword(hashed, id);
  }

  // General
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const hashed = await this.userSecurity.hashPassword(password);

    await this.userOperationRepository.modifyUserPassword(hashed, email);
  }

  // General
  async deleteUser(id: string): Promise<void> {
    await this.userOperationRepository.deleteUser(id);
  }
}
