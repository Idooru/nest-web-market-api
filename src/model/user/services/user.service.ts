import { UserUpdateRepository } from "../repositories/user-update.repository";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { ModifyUserAuthDto, ModifyUserDto, ModifyUserProfileDto } from "../dtos/modify-user.dto";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserEventMapSetter } from "../logic/user-event-map.setter";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "src/common/decorators/general.decoration";
import { SendMailToClientAboutRegisterDto } from "../dtos/send-mail-to-client-about-register.dto";

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
  public async createUserBase({ id }: UserEntity, registerUserDto: RegisterUserDto): Promise<void> {
    const { realName, nickName, birth, gender, email, phoneNumber, password, address } = registerUserDto;
    const hashed = await this.userSecurity.hashPassword(password, true);

    const userProfileColumn = {
      id,
      realName,
      birth,
      gender,
      phoneNumber,
      address,
    };

    const userAuthColumn = { id, nickName, email, password: hashed };
    const sendMailToClientAboutRegisterDto = { email, nickName };

    await Promise.all([
      this.userUpdateRepository.createUserProfile(userProfileColumn),
      this.userUpdateRepository.createUserAuth(userAuthColumn),
    ]);

    this.userEventMapSetter.setRegisterEventParam(sendMailToClientAboutRegisterDto);
  }

  @Transaction
  public async modifyUser(dto: ModifyUserDto, id: string): Promise<void> {
    const { password, phoneNumber, email, nickName, address } = dto;
    const hashed = await this.userSecurity.hashPassword(password, true);

    const modifyUserProfileDto: ModifyUserProfileDto = {
      phoneNumber,
      address,
    };

    const modifyUserAuthDto: ModifyUserAuthDto = {
      email,
      nickName,
      password: hashed,
    };

    await Promise.all([
      this.userUpdateRepository.modifyUserProfile(modifyUserProfileDto, id),
      this.userUpdateRepository.modifyUserAuth(modifyUserAuthDto, id),
    ]);
  }

  @General
  public async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserEmail(email, id);
  }

  @General
  public async modifyUserNickname(nickName: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserNickname(nickName, id);
  }

  @General
  public async modifyUserPhonenumber(phoneNumber: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserPhonenumber(phoneNumber, id);
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
