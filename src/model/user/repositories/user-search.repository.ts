import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserSelect } from "src/common/config/repository-select-configs/user.select";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class UserSearchRepository {
  constructor(
    @Inject("user-select")
    private readonly select: UserSelect,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {}

  public async findAllUsers(column: string, order: "ASC" | "DESC"): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder()
      .select(this.select.users)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .orderBy(column, order)
      .groupBy("user.id")
      .getRawMany();

    if (!users.length) {
      const message = "사용자가 없습니다.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return users;
  }

  public findUserWithId(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("user.id = :id", { id })
      .getOne();
  }

  public findClientUserWithId(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.clientUser)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.clientActions", "Client")
      .where("user.id = :id", { id })
      .getOne();
  }

  public async findAdminUserWithId(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.adminUser)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.adminActions", "Admin")
      .where("user.id = :id", { id })
      .getOne();
  }

  public async findClientUserObjectWithId(user: UserEntity): Promise<ClientUserEntity> {
    return this.clientUserRepository
      .createQueryBuilder()
      .select(["client", "User", "Auth", "Account"])
      .from(ClientUserEntity, "client")
      .innerJoin("client.User", "User")
      .innerJoin("User.Auth", "Auth")
      .leftJoin("User.Account", "Account")
      .where("client.id = :id", { id: user.clientActions.id })
      .getOne();
  }

  public async findAdminUserObjectWithId(user: UserEntity): Promise<AdminUserEntity> {
    return this.adminUserRepository
      .createQueryBuilder()
      .select(["admin", "User", "Account"])
      .from(AdminUserEntity, "admin")
      .innerJoin("admin.User", "User")
      .leftJoin("User.Account", "Account")
      .where("admin.id = :id", { id: user.adminActions.id })
      .getOne();
  }

  public findUserWithEmail(email: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Auth.email = :email", { email })
      .getOne();
  }

  public findUserWithRealName(realName: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Profile.realName = :realName", { realName })
      .getOne();
  }

  public findUserWithPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Profile.phoneNumber = :phoneNumber", { phoneNumber })
      .getOne();
  }

  public findUserProfile(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.profile)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("user.id = :id", { id })
      .getRawOne();
  }

  public findClientUserInfo(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.select.whenAdminClientUser)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.clientActions", "Client")
      .leftJoin("Client.Payment", "Payment")
      .leftJoin("Payment.Product", "Product")
      .leftJoin("Product.Image", "ProductImage")
      .leftJoin("Client.writtenReview", "Review")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Client.writtenInquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .where("user.id = :id", { id })
      .getOne();
  }

  public async findRefreshToken(id: string): Promise<string> {
    const user = await this.userRepository
      .createQueryBuilder()
      .select(["user", "Auth"])
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .where("user.id = :id", { id })
      .getOne();

    return user.Auth.refreshToken;
  }
}
