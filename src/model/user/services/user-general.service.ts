import { ModifyUserDto } from "../dtos/modify-user.dto";
import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { SecurityLibrary } from "src/common/lib/security.library";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import { UserInsertRepository } from "../repositories/user-insert.repository";

@Injectable()
export class UserGeneralService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly userInsertRepository: UserInsertRepository,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromLatest();
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromOldest();
  }

  async findClientUserInfoFromAdmin(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserInfoFromAdmin(id);
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserProfileInfoWithId(id);
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findAdminUserProfileInfoWithId(id);
  }

  async createUserBase(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { password } = registerUserDto;

    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.createUserBase(registerUserDto, hashed);

    const [userProfile, userAuth, userBase] = await Promise.all([
      this.userInsertRepository.findLastCreatedUserProfile(),
      this.userInsertRepository.findLastCreatedUserAuth(),
      this.userInsertRepository.findLastCreatedUserBase(),
    ]);

    await Promise.all([
      this.userInsertRepository.insertUserBaseIdOnUserProfile(
        userBase,
        userProfile,
      ),
      this.userInsertRepository.insertUserBaseIdOnUserAuth(userBase, userAuth),
    ]);

    return userBase;
  }

  async createClientOrAdmin(
    registerUserDto: RegisterUserDto,
    userBase: UserEntity,
  ) {
    if (registerUserDto.type.toString() === "client") {
      await this.userGeneralRepository.createClientUser(userBase);
      const clientUser =
        await this.userInsertRepository.findLastCreatedClientUser();
      await this.userInsertRepository.insertUserBaseIdOnClientUser(
        userBase,
        clientUser,
      );
    } else {
      await this.userGeneralRepository.createAdminUser(userBase);
      const adminUser =
        await this.userInsertRepository.findLastCreatedAdminUser();
      await this.userInsertRepository.insertUserBaseIdOnAdminUser(
        userBase,
        adminUser,
      );
    }
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    userId: string,
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    const { password } = modifyUserDto;
    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.modifyUser(
      modifyUserDto,
      hashed,
      user.Profile.id,
      user.Auth.id,
    );
  }

  async modifyUserEmail(email: string, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserEmail(email, user.Auth.id);
  }

  async modifyUserNickName(nickname: string, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserNickName(nickname, user.Auth.id);
  }

  async modifyUserPhoneNumber(
    phonenumber: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserPhoneNumber(
      phonenumber,
      user.Profile.id,
    );
  }

  async modifyUserPassword(password: string, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.modifyUserPassword(hashed, user.Auth.id);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userGeneralRepository.deleteUser(userId);
  }
}
