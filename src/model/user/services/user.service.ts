import { UserUpdateRepository } from "../repositories/user-update.repository";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { UserSearcher } from "../logic/user.searcher";
import { UserSecurity } from "../logic/user.security";
import { UserEventMapSetter } from "../logic/user-event-map.setter";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "src/common/decorators/general.decoration";
import { UserRole } from "../types/user-role.type";
import { RegisterUserDto } from "../dto/request/register-user.dto";
import { ModifyUserAuthDto, ModifyUserDto, ModifyUserProfileDto } from "../dto/request/modify-user.dto";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { BasicAuthDto } from "../dto/request/basic-auth.dto";

class EntityFinder {
  constructor(private readonly userSearcher: UserSearcher) {}

  public findUser(email: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: "UserAuth.email = :email",
      alias: { email },
      getOne: true,
      entities: [UserAuthEntity],
    }) as Promise<UserEntity>;
  }
}

@Injectable()
export class UserService {
  private readonly entityFinder: EntityFinder;

  constructor(
    protected readonly userSearcher: UserSearcher,
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userSecurity: UserSecurity,
    private readonly userEventMapSetter: UserEventMapSetter,
  ) {
    this.entityFinder = new EntityFinder(this.userSearcher);
  }

  @Transaction
  public async createUserEntity(role: UserRole): Promise<UserEntity> {
    const user = await this.userUpdateRepository.createUserEntity(role);

    if (role.toString() === "admin") {
      await this.userUpdateRepository.createAdminUser(user);
    } else {
      await this.userUpdateRepository.createClientUser(user);
    }

    return user;
  }

  @Transaction
  public async createUserBase({ id }: UserEntity, dto: RegisterUserDto): Promise<void> {
    const { realName, nickName, birth, gender, email, phoneNumber, password, address } = dto;
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
  public async modifyUser(dto: ModifyUserDto): Promise<void> {
    const { id, body } = dto;
    const { password, phoneNumber, email, nickName, address } = body;
    const hashed = await this.userSecurity.hashPassword(password, true);

    const modifyUserProfileDto: ModifyUserProfileDto = { phoneNumber, address };
    const modifyUserAuthDto: ModifyUserAuthDto = { email, nickName, password: hashed };

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
  public async modifyUserPhoneNumber(phoneNumber: string, id: string): Promise<void> {
    await this.userUpdateRepository.modifyUserPhoneNumber(phoneNumber, id);
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
  public async resetPassword(dto: BasicAuthDto): Promise<void> {
    const { email, password } = dto;
    const [hashed, user] = await Promise.all([
      this.userSecurity.hashPassword(password, false),
      this.entityFinder.findUser(email),
    ]);

    await this.userUpdateRepository.modifyUserPassword(hashed, user.id);
  }

  @General
  public async deleteUser(id: string): Promise<void> {
    await this.userUpdateRepository.deleteUser(id);
  }
}
