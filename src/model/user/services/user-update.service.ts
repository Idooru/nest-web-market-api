import { UserUpdateRepository } from "../repositories/user-update.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserEventMapSetter } from "../logic/user-event-map.setter";

@Injectable()
export class UserUpdateService {
  constructor(
    private readonly userOperationRepository: UserUpdateRepository,
    private readonly userSearcher: UserSearcher,
    private readonly userSecurity: UserSecurity,
    private readonly userEventMapSetter: UserEventMapSetter,
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
  ): Promise<void> {
    const { id } = user;
    const { realname, nickname, birth, gender, email, phonenumber, password } =
      registerUserDto;

    const hashed = await this.userSecurity.hashPassword(password, true);

    const userProfileColumn = { id, realname, birth, gender, phonenumber };
    const userAuthColumn = { id, nickname, email, password: hashed };

    await Promise.all([
      this.userOperationRepository.createUserProfile(userProfileColumn),
      this.userOperationRepository.createUserAuth(userAuthColumn),
    ]);

    this.userEventMapSetter.setRegisterEventParam({ email, nickname });
  }

  // Transaction
  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const { password, phonenumber, email, nickname } = modifyUserDto;

    const hashed = await this.userSecurity.hashPassword(password, true);

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
    await this.userOperationRepository.modifyUserEmail(email, id);
  }

  // General
  async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userOperationRepository.modifyUserNickname(nickname, id);
  }

  // General
  async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userOperationRepository.modifyUserPhonenumber(phonenumber, id);
  }

  // General
  async modifyUserPassword(password: string, id: string): Promise<void> {
    const hashed = await this.userSecurity.hashPassword(password, false);

    await this.userOperationRepository.modifyUserPassword(hashed, id);
  }

  // General
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const hashed = await this.userSecurity.hashPassword(password, false);

    const user = await this.userSearcher.findUserWithEmail(email);

    await this.userOperationRepository.modifyUserPassword(hashed, user.id);
  }

  // General
  async deleteUser(id: string): Promise<void> {
    await this.userOperationRepository.deleteUser(id);
  }
}
