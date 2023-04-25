import { Inject, Injectable } from "@nestjs/common";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { InsertResult, Repository } from "typeorm";
import { UserSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { ClientUserEntity } from "../entities/client-user.entity";
import { RegisterUserProfileDto } from "../dtos/register-user.dto";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { UserEntity } from "../entities/user.entity";
import { CreateUserBaseDto } from "../dtos/create-user-base.dto";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { RegisterUserAuthDto } from "../dtos/register-user.dto";
import { ModifyUserProfileDto } from "../dtos/modify-user.dto";
import { ModifyUserAuthDto } from "../dtos/modify-user.dto";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class UserGeneralRepository extends ErrorHandlerProps {
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
    @Inject("UserSelectProperty") private readonly select: UserSelectProperty,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder<unknown>,
  ) {
    super();
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimple)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.methodName = this.findAllUsersFromLatest.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimple)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.methodName = this.findAllUsersFromOldest.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUserWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findClientUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.clientUser)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findClientUserWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findAdminUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.adminUser)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.adminActions", "Admin")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAdminUserWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    try {
      const user = await this.findClientUserWithId(id);

      return await this.clientUserRepository
        .createQueryBuilder()
        .select(["client"])
        .from(ClientUserEntity, "client")
        .where("client.id = :id", { id: user.clientActions.id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findClientUserObjectWithId.name;
      this.errorHandlerBuilder
        .setEntity(new ClientUserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    try {
      const user = await this.findAdminUserWithId(id);

      return await this.adminUserRepository
        .createQueryBuilder()
        .select(["admin"])
        .from(AdminUserEntity, "admin")
        .where("admin.id = :id", { id: user.adminActions.id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAdminUserObjectWithId.name;
      this.errorHandlerBuilder
        .setEntity(new AdminUserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUserWithEmail.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUserWithNickName.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(nickname, "nickname")
        .setLayer("repository")
        .handle();
    }
  }

  async findUserWithRealName(realname: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.realname = :realname", { realname })
        .getOne();
    } catch (err) {
      this.methodName = this.findUserWithRealName.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findUserWithPhoneNumber(
    phonenumber: string,
  ): Promise<UserEntity | null> {
    try {
      return await this.clientUserRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .leftJoin("user.Profile", "Profile")
        .leftJoin("user.Auth", "Auth")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOne();
    } catch (err) {
      this.methodName = this.findUserWithPhoneNumber.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.clientUserProfile)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .leftJoin("Client.purchasedProduct", "Product")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Client.writtenReview", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Client.writtenInquiryRequest", "InquiryRequest")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
        .leftJoin("InquiryRequest.InquiryResponse", "InquiryResponse")
        .leftJoin("InquiryResponse.Image", "InquiryResponseImage")
        .leftJoin("InquiryResponse.Video", "InquiryResponseVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findClientUserProfileInfoWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.adminUserProfile)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.adminActions", "Admin")
        .leftJoin("Admin.createdProduct", "Product")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Product.StarRate", "StarRate")
        .leftJoin("Product.Review", "Review")
        .leftJoin("Product.InquiryRequest", "InquiryRequest")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Admin.writtenInquiryResponse", "InquiryResponse")
        .leftJoin("InquiryResponse.Image", "InquiryResponseImage")
        .leftJoin("InquiryResponse.Video", "InquiryResponseVideo")
        .leftJoin("InquiryResponse.InquiryRequest", "ReceivedInquiryRequest")
        .leftJoin("ReceivedInquiryRequest.Image", "ReceivedInquiryRequestImage")
        .leftJoin("ReceivedInquiryRequest.Video", "ReceivedInquiryRequestVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAdminUserProfileInfoWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findClientUserInfoFromAdminWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.whenAdminClientUser)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.clientActions", "Client")
        .leftJoin("Client.purchasedProduct", "Product")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Client.writtenReview", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Client.writtenInquiryRequest", "InquiryRequest")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findClientUserInfoFromAdminWithId.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
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
      this.methodName = this.resetPassword.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createUserProfile(
    registerUserProfileDto: RegisterUserProfileDto,
  ): Promise<UserProfileEntity> {
    try {
      return await this.userProfileRepository.save({
        ...registerUserProfileDto,
      });
    } catch (err) {
      this.methodName = this.createUserProfile.name;
      this.errorHandlerBuilder
        .setEntity(new UserProfileEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createUserAuth(
    registerUserAuthDto: RegisterUserAuthDto,
  ): Promise<UserAuthEntity> {
    try {
      return await this.userAuthRepository.save({ ...registerUserAuthDto });
    } catch (err) {
      this.methodName = this.createUserAuth.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findUserProfile(
    userProfileDummy: UserProfileEntity,
  ): Promise<UserProfileEntity> {
    try {
      return this.userProfileRepository
        .createQueryBuilder()
        .select("profile")
        .from(UserProfileEntity, "profile")
        .where("profile.id = :id", { id: userProfileDummy.id })
        .getOne();
    } catch (err) {
      this.methodName = this.findUserProfile.name;
      this.errorHandlerBuilder
        .setEntity(new UserProfileEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findUserAuth(userAuthDummy: UserAuthEntity): Promise<UserAuthEntity> {
    try {
      return this.userAuthRepository
        .createQueryBuilder()
        .select("auth")
        .from(UserAuthEntity, "auth")
        .where("auth.id = :id", { id: userAuthDummy.id })
        .getOne();
    } catch (err) {
      this.methodName = this.findUserAuth.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createUserBase(
    createUserBaseDto: CreateUserBaseDto,
  ): Promise<InsertResult> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({ ...createUserBaseDto })
        .execute();
    } catch (err) {
      this.methodName = this.createUserBase.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createClientUser(user: UserEntity): Promise<InsertResult> {
    try {
      return await this.clientUserRepository
        .createQueryBuilder()
        .insert()
        .into(ClientUserEntity)
        .values({ User: user })
        .execute();
    } catch (err) {
      this.methodName = this.createClientUser.name;
      this.errorHandlerBuilder
        .setEntity(new ClientUserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createAdminUser(user: UserEntity): Promise<InsertResult> {
    try {
      return await this.adminUserRepository
        .createQueryBuilder()
        .insert()
        .into(AdminUserEntity)
        .values({ User: user })
        .execute();
    } catch (err) {
      this.methodName = this.createAdminUser.name;
      this.errorHandlerBuilder
        .setEntity(new AdminUserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async modifyUserProfile(
    modifyUserProfileDto: ModifyUserProfileDto,
    id: string,
  ): Promise<void> {
    try {
      await this.userProfileRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ ...modifyUserProfileDto })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyUserProfile.name;
      this.errorHandlerBuilder
        .setEntity(new UserProfileEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async modifyUserAuth(
    modifyUserAuthDto: ModifyUserAuthDto,
    id: string,
  ): Promise<void> {
    try {
      await this.userAuthRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ ...modifyUserAuthDto })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyUserAuth.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.modifyUserEmail.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.modifyUserNickName.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.modifyUserPhoneNumber.name;
      this.errorHandlerBuilder
        .setEntity(new UserProfileEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.modifyUserPassword.name;
      this.errorHandlerBuilder
        .setEntity(new UserAuthEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.deleteUser.name;
      this.errorHandlerBuilder
        .setEntity(new UserEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
