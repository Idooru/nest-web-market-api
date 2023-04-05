import { Injectable } from "@nestjs/common";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { userSelectProperty } from "src/common/config/repository-select-configs/user-select";
import { ClientUserEntity } from "../entities/client-user.entity";
import { RegisterUserProfileDto } from "../dtos/register-user.dto";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { UserEntity } from "../entities/user.entity";
import { CreateUserBaseDto } from "../dtos/create-user-base.dto";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { RegisterUserAuthDto } from "../dtos/register-user.dto";
import { ModifyUserProfileDto } from "../dtos/modify-user.dto";
import { ModifyUserAuthDto } from "../dtos/modify-user.dto";

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
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
  ) {
    super();
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
      this.methodName = this.findAllUsersFromLatest.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findAllUsersFromOldest.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findUserWithId.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.methodName = this.findClientUserWithId.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.methodName = this.findAdminUserWithId.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
    }
  }

  async findClientUserObject(id: string): Promise<ClientUserEntity> {
    try {
      const user = await this.findClientUserWithId(id);

      return await this.clientUserRepository
        .createQueryBuilder()
        .select(["client"])
        .from(ClientUserEntity, "client")
        .where("client.id = :id", { id: user.clientActions.id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findClientUserObject.name;
      this.repositoryErrorHandler.init<ClientUserEntity>(
        new ClientUserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
    }
  }

  async findAdminUserObject(id: string): Promise<AdminUserEntity> {
    try {
      const user = await this.findAdminUserWithId(id);

      return await this.adminUserRepository
        .createQueryBuilder()
        .select(["admin"])
        .from(AdminUserEntity, "admin")
        .where("admin.id = :id", { id: user.adminActions.id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAdminUserObject.name;
      this.repositoryErrorHandler.init<AdminUserEntity>(
        new AdminUserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
    }
  }

  async findAdminUserObjectWithoutId(): Promise<AdminUserEntity> {
    try {
      return await this.adminUserRepository
        .createQueryBuilder()
        .select(["admin"])
        .from(AdminUserEntity, "admin")
        .orderBy("admin.createdAt", "DESC")
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAdminUserObjectWithoutId.name;
      this.repositoryErrorHandler.init<AdminUserEntity>(
        new AdminUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findUserWithEmail.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: email, stuffMean: "이메일" },
      );
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
      this.methodName = this.findUserWithNickName.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: nickname, stuffMean: "닉네임" },
      );
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
      this.methodName = this.findUserWithRealName.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findUserWithPhoneNumber.name;
      this.repositoryErrorHandler.init<ClientUserEntity>(
        new ClientUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.methodName = this.findClientUserInfoFromAdmin.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async createUserAuth(
    registerUserAuthDto: RegisterUserAuthDto,
  ): Promise<UserAuthEntity> {
    try {
      return await this.userAuthRepository.save({ ...registerUserAuthDto });
    } catch (err) {
      this.methodName = this.createUserAuth.name;
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async createUserBase(createUserBaseDto: CreateUserBaseDto): Promise<void> {
    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values({ ...createUserBaseDto })
        .execute();
    } catch (err) {
      this.methodName = this.createUserBase.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ClientUserEntity>(
        new ClientUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<AdminUserEntity>(
        new AdminUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
