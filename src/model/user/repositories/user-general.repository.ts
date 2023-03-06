import { Injectable, Logger } from "@nestjs/common";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { userSelectProperty } from "src/common/config/repository-select-configs/user-select";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { ClientUserEntity } from "../entities/client-user.entity";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { UserEntity } from "../entities/user.entity";
import { CreateUserBaseDto } from "../dtos/create-user-base.dto";

@Injectable()
export class UserGeneralRepository {
  private readonly select = userSelectProperty;
  private readonly logger = new Logger("Repository");

  constructor(
    @InjectRepository(UserEntity)
    private readonly userGeneralRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthGeneralRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileGeneralRepository: Repository<UserProfileEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserGeneralRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserGeneralRepository: Repository<AdminUserEntity>,
  ) {}

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimpleSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimpleSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserProfileSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .leftJoin("Client.purchasedProduct", "Product")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Client.writtenReview", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Client.writtenInquiry", "Inquiry")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.adminUserProfileSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.adminActions", "Admin")
        .leftJoin("Admin.receivedInquiry", "Inquiry")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserInfoFromAdmin(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.whenAdminSelectClientUser)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .leftJoin("Client.purchasedProduct", "Product")
        .leftJoin("Client.writtenReview", "Review")
        .leftJoin("Client.writtenInquiry", "Inquiry")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedUserProfile(): Promise<UserProfileEntity> {
    try {
      return await this.userProfileGeneralRepository
        .createQueryBuilder()
        .select("profile")
        .from(UserProfileEntity, "profile")
        .orderBy("profile.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedUserAuth(): Promise<UserAuthEntity> {
    try {
      return await this.userAuthGeneralRepository
        .createQueryBuilder()
        .select("auth")
        .from(UserAuthEntity, "auth")
        .orderBy("auth.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedUserBase(): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select("userBase")
        .from(UserEntity, "userBase")
        .orderBy("userBase.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedClientUser(): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select("clientUser")
        .from(ClientUserEntity, "clientUser")
        .orderBy("clientUser.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedAdminUser(): Promise<AdminUserEntity> {
    try {
      return await this.adminUserGeneralRepository
        .createQueryBuilder()
        .select("adminUser")
        .from(AdminUserEntity, "adminUser")
        .orderBy("adminUser.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async resetPassword(id: string, hashed: string) {
    try {
      const password = { password: hashed };
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ ...password })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createUserBase(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    try {
      const password = hashed;
      const { realname, nickname, birth, gender, email, phonenumber, type } =
        registerUserDto;

      const userProfileColumn = { realname, birth, gender, phonenumber };
      const userAuthColumn = { nickname, email, password };

      const [userProfile, userAuth] = await Promise.all([
        this.userProfileGeneralRepository.save({ ...userProfileColumn }),
        this.userAuthGeneralRepository.save({ ...userAuthColumn }),
      ]);

      const [userProfileObject, userAuthObject] = await Promise.all([
        this.userProfileGeneralRepository
          .createQueryBuilder()
          .select("profile")
          .from(UserProfileEntity, "profile")
          .where("profile.id = :id", { id: userProfile.id })
          .getOne(),
        this.userAuthGeneralRepository
          .createQueryBuilder()
          .select("auth")
          .from(UserAuthEntity, "auth")
          .where("auth.id = :id", { id: userAuth.id })
          .getOne(),
      ]);

      const createUserBaseDto: CreateUserBaseDto = {
        Profile: userProfileObject,
        Auth: userAuthObject,
        type,
      };

      await this.userGeneralRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({ ...createUserBaseDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createClientUser(user: UserEntity): Promise<void> {
    try {
      await this.clientUserGeneralRepository
        .createQueryBuilder()
        .insert()
        .into(ClientUserEntity)
        .values({ User: user })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createAdminUser(user: UserEntity): Promise<void> {
    try {
      await this.adminUserGeneralRepository
        .createQueryBuilder()
        .insert()
        .into(AdminUserEntity)
        .values({ User: user })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    password: string,
    userProfileId: string,
    userAuthId: string,
  ): Promise<void> {
    try {
      const { phonenumber, nickname, email } = modifyUserDto;

      await Promise.all([
        this.userProfileGeneralRepository
          .createQueryBuilder()
          .update(UserProfileEntity)
          .set({ phonenumber })
          .where("id = :id", { id: userProfileId })
          .execute(),
        this.userAuthGeneralRepository
          .createQueryBuilder()
          .update(UserAuthEntity)
          .set({ email, nickname, password })
          .where("id = :id", { id: userAuthId })
          .execute(),
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserEmail(email: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ email })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserNickName(nickname: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ nickname })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserPhoneNumber(phonenumber: string, id: string): Promise<void> {
    try {
      await this.userProfileGeneralRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ phonenumber })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserPassword(password: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ password })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userGeneralRepository
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnUserProfile(
    userBase: UserEntity,
    userProfile: UserProfileEntity,
  ): Promise<void> {
    try {
      await this.userProfileGeneralRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ User: userBase })
        .where("id = :id", { id: userProfile.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnUserAuth(
    userBase: UserEntity,
    userAuth: UserAuthEntity,
  ): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ User: userBase })
        .where("id = :id", { id: userAuth.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnClientUser(
    userBase: UserEntity,
    clientUser: ClientUserEntity,
  ): Promise<void> {
    try {
      await this.clientUserGeneralRepository
        .createQueryBuilder()
        .update(ClientUserEntity)
        .set({ User: userBase })
        .where("id = :id", { id: clientUser.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnAdminUser(
    userBase: UserEntity,
    adminUser: AdminUserEntity,
  ): Promise<void> {
    try {
      await this.adminUserGeneralRepository
        .createQueryBuilder()
        .update(AdminUserEntity)
        .set({ User: userBase })
        .where("id = :id", { id: adminUser.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
