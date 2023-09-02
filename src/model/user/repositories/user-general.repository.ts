import { Inject, Injectable } from "@nestjs/common";
import { UserAuthEntity } from "src/model/user/entities/user-auth.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { Repository } from "typeorm";
import { UserSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { ClientUserEntity } from "../entities/client-user.entity";
import {
  CreateUserAuthDto,
  CreateUserProfileDto,
} from "../dtos/register-user.dto";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { UserEntity } from "../entities/user.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { ModifyUserProfileDto } from "../dtos/modify-user.dto";
import { ModifyUserAuthDto } from "../dtos/modify-user.dto";
import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { UserErrorHandler } from "../error/user-error.handler";
import { ClientUserErrorHandler } from "../error/client-user-error.handler";
import { AdminUserErrorHandler } from "../error/admin-user-error.handler";
import { IUserGeneralRepository } from "../interfaces/repositories/user-general-repository.interface";

@Injectable()
export class UserGeneralRepository
  extends ErrorHandlerProps
  implements IUserGeneralRepository
{
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
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ClientUserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(AdminUserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(email, "email")
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(nickname, "nickname")
        .handle();
    }
  }

  async findUserForgotten(
    realname: string,
    phonenumber: string,
  ): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userBase)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Profile.realname = :realname", { realname })
        .andWhere("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUserForgotten.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(realname, "realname")
        .setStuffs(phonenumber, "phonenumber")
        .handle();
    }
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      const client = await this.userRepository
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

      client.clientActions.id = undefined;
      return client;
    } catch (err) {
      this.methodName = this.findClientUserProfileInfoWithId.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      const admin = await this.userRepository
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

      admin.adminActions.id = undefined;
      return admin;
    } catch (err) {
      this.methodName = this.findAdminUserProfileInfoWithId.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
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
      this.methodName = this.findClientUserInfo.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async resetPassword(id: string, hashed: string): Promise<void> {
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    try {
      return await this.userRepository.save({ role });
    } catch (err) {
      this.methodName = this.createUserEntity.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async createUserProfile(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfileEntity> {
    try {
      return await this.userProfileRepository.save({
        ...createUserProfileDto,
      });
    } catch (err) {
      this.methodName = this.createUserProfile.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async createUserAuth(
    createUserAuthDto: CreateUserAuthDto,
  ): Promise<UserAuthEntity> {
    try {
      return await this.userAuthRepository.save({ ...createUserAuthDto });
    } catch (err) {
      this.methodName = this.createUserAuth.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.methodName = this.createClientUser.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ClientUserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.methodName = this.createAdminUser.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(AdminUserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(UserErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
