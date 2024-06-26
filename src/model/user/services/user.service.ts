import { UserUpdateRepository } from "../repositories/user-update.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserEventMapSetter } from "../logic/user-event-map.setter";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "src/common/decorators/general.decoration";

@Injectable()
export class UserService {
  constructor(
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userSearcher: UserSearcher,
    @Inject(forwardRef(() => UserSecurity))
    private readonly userSecurity: UserSecurity,
    private readonly userEventMapSetter: UserEventMapSetter,
  ) {}

  @Transaction
  public async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    const user = await this.userUpdateRepository.createUserEntity(role);

    if (role.toString() === "admin") {
      await this.userUpdateRepository.createAdminUser(user);
    } else {
      await this.userUpdateRepository.createClientUser(user);
    }

    return user;
  }

  @Transaction
  public async createUserBase(user: UserEntity, registerUserDto: RegisterUserDto): Promise<void> {
    const { id } = user;
    const { realname, nickname, birth, gender, email, phonenumber, password, address } = registerUserDto;

    const hashed = await this.userSecurity.hashPassword(password, true);

    const userProfileColumn = {
      id,
      realname,
      birth,
      gender,
      phonenumber,
      address,
    };
    const userAuthColumn = { id, nickname, email, password: hashed };

    await Promise.all([
      this.userUpdateRepository.createUserProfile(userProfileColumn),
      this.userUpdateRepository.createUserAuth(userAuthColumn),
    ]);

    this.userEventMapSetter.setRegisterEventParam({ email, nickname });
  }

  @Transaction
  public async modifyUser(dto: ModifyUserDto, id: string): Promise<void> {
    const { password, phonenumber, email, nickname, address } = dto;

    const hashed = await this.userSecurity.hashPassword(password, true);

    await Promise.all([
      this.userUpdateRepository.modifyUserProfile({ phonenumber, address }, id),
      this.userUpdateRepository.modifyUserAuth({ email, nickname, password: hashed }, id),
    ]);
  }

  @General
  public async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserEmail(email, id);
  }

  @General
  public async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserNickname(nickname, id);
  }

  @General
  public async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserPhonenumber(phonenumber, id);
  }

  @General
  public async modifyUserPassword(password: string, id: string): Promise<void> {
    const hashed = await this.userSecurity.hashPassword(password, false);

    await this.userUpdateRepository.modifyUserPassword(hashed, id);
  }

  @General
  public async modifyUserAddress(address: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserAddress(address, id);
  }

  @General
  public async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { email, password } = dto;
    const hashed = await this.userSecurity.hashPassword(password, false);

    const user = await this.userSearcher.findUserWithEmail(email);

    await this.userUpdateRepository.modifyUserPassword(hashed, user.id);
  }

  @General
  public async deleteUser(id: string): Promise<void> {
    await this.userUpdateRepository.deleteUser(id);
  }
}
