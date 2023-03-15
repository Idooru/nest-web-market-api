import { Injectable } from "@nestjs/common";
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
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class UserGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {
    super("User General");
  }

  private readonly select = userSelectProperty;

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    try {
      return await this.userRepository
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
      return await this.userRepository
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
      return await this.userRepository
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

  async findClientUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAdminUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.adminUserSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.adminActions", "Admin")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserObject(userId: string): Promise<ClientUserEntity> {
    try {
      const user = await this.findClientUserWithId(userId);

      return await this.clientUserRepository
        .createQueryBuilder()
        .select(["client"])
        .from(ClientUserEntity, "client")
        .where("client.id = :id", { id: user.clientActions.id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAdminUserObject(userId: string): Promise<AdminUserEntity> {
    try {
      const user = await this.findAdminUserWithId(userId);

      return await this.adminUserRepository
        .createQueryBuilder()
        .select(["admin"])
        .from(AdminUserEntity, "admin")
        .where("admin.id = :id", { id: user.adminActions.id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository
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
      return await this.userRepository
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

  async findUserWithRealName(realname: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.realname = :realname", { realname })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithPhoneNumber(
    phonenumber: string,
  ): Promise<UserEntity | null> {
    try {
      return await this.clientUserRepository
        .createQueryBuilder()
        .select(this.select.userBaseSelect)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
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
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.adminUserProfileSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.adminActions", "Admin")
        .leftJoin("Admin.createdProduct", "Product")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Product.StarRate", "StarRate")
        .leftJoin("Product.Review", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Product.Inquiry", "Inquiry")
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
      return await this.userRepository
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

  async findCurrentAdminUser(): Promise<AdminUserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(["admin", "User", "Auth"])
        .from(AdminUserEntity, "admin")
        .innerJoin("admin.User", "User")
        .innerJoin("User.Auth", "Auth")
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async resetPassword(id: string, hashed: string) {
    try {
      const password = { password: hashed };
      await this.userAuthRepository
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
        this.userProfileRepository.save({ ...userProfileColumn }),
        this.userAuthRepository.save({ ...userAuthColumn }),
      ]);

      const [userProfileObject, userAuthObject] = await Promise.all([
        this.userProfileRepository
          .createQueryBuilder()
          .select("profile")
          .from(UserProfileEntity, "profile")
          .where("profile.id = :id", { id: userProfile.id })
          .getOne(),
        this.userAuthRepository
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

      await this.userRepository
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
      await this.clientUserRepository
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
      await this.adminUserRepository
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
        this.userProfileRepository
          .createQueryBuilder()
          .update(UserProfileEntity)
          .set({ phonenumber })
          .where("id = :id", { id: userProfileId })
          .execute(),
        this.userAuthRepository
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
      await this.userAuthRepository
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
      await this.userAuthRepository
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
      await this.userProfileRepository
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
      await this.userAuthRepository
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
      await this.userRepository
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
}
