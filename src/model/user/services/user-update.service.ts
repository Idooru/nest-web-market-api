import { UserUpdateRepository } from "../repositories/user-update.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserEventMapSetter } from "../logic/user-event-map.setter";
import { UserAuthEntity } from "../entities/user-auth.entity";

@Injectable()
export class UserUpdateService {
  constructor(
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userSearcher: UserSearcher,
    @Inject(forwardRef(() => UserSecurity))
    private readonly userSecurity: UserSecurity,
    private readonly userEventMapSetter: UserEventMapSetter,
  ) {}

  // Transaction
  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    const user = await this.userUpdateRepository.createUserEntity(role);

    if (role.toString() === "admin") {
      await this.userUpdateRepository.createAdminUser(user);
    } else {
      await this.userUpdateRepository.createClientUser(user);
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
      this.userUpdateRepository.createUserProfile(userProfileColumn),
      this.userUpdateRepository.createUserAuth(userAuthColumn),
    ]);

    this.userEventMapSetter.setRegisterEventParam({ email, nickname });
  }

  // Transaction
  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const { password, phonenumber, email, nickname } = modifyUserDto;

    const hashed = await this.userSecurity.hashPassword(password, true);

    await Promise.all([
      this.userUpdateRepository.modifyUserProfile({ phonenumber }, id),
      this.userUpdateRepository.modifyUserAuth(
        { email, nickname, password: hashed },
        id,
      ),
    ]);
  }

  // General
  async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserEmail(email, id);
  }

  // General
  async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserNickname(nickname, id);
  }

  // General
  async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserPhonenumber(phonenumber, id);
  }

  // General
  async modifyUserPassword(password: string, id: string): Promise<void> {
    const hashed = await this.userSecurity.hashPassword(password, false);

    await this.userUpdateRepository.modifyUserPassword(hashed, id);
  }

  // General
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const hashed = await this.userSecurity.hashPassword(password, false);

    const user = await this.userSearcher.findUserWithEmail(email);

    await this.userUpdateRepository.modifyUserPassword(hashed, user.id);
  }

  // General
  async deleteUser(id: string): Promise<void> {
    await this.userUpdateRepository.deleteUser(id);
  }

  // General
  async initRefreshToken(refreshToken: string, id: string): Promise<void> {
    await this.userUpdateRepository.initRefreshToken(refreshToken, id);
  }

  // General
  async removeRefreshToken(id: string): Promise<void> {
    await this.userUpdateRepository.removeRefreshToken(id);
  }
}
