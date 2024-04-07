import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { FindEmailDto } from "../dtos/find-email.dto";

@Injectable()
export class UserSearchRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    @Inject("UserSelectProperty")
    private readonly userSelect: UserSelectProperty,
  ) {}

  public async findAllUsersFromLatest(): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserSimple)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .orderBy("user.createdAt", "DESC")
      .getMany();

    if (!users.length) {
      const message = "사용자가 없습니다.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return users;
  }

  public async findAllUsersFromOldest(): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserSimple)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .orderBy("user.createdAt", "ASC")
      .getMany();

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
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("user.id = :id", { id })
      .getOne();
  }

  public findClientUserWithId(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUser)
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
      .select(this.userSelect.adminUser)
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
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Auth.email = :email", { email })
      .getOne();
  }

  public findUserForgotten(dto: FindEmailDto): Promise<UserEntity> {
    const { realname, phonenumber } = dto;
    return this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Profile.realname = :realname", { realname })
      .andWhere("Profile.phonenumber = :phonenumber", { phonenumber })
      .getOne();
  }

  public async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    const clientUser = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserProfile)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .leftJoin("user.Account", "Account")
      .innerJoin("user.clientActions", "Client")
      .leftJoin("Client.Cart", "Cart")
      .leftJoin("Cart.Product", "CartProduct")
      .leftJoin("CartProduct.Image", "CartProductImage")
      .leftJoin("Client.Order", "Order")
      .leftJoin("Order.Payment", "Payment")
      .leftJoin("Payment.Product", "PaymentProduct")
      .leftJoin("PaymentProduct.Image", "PaymentProductImage")
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
      .getOne();

    clientUser.Auth.password = undefined;

    return clientUser;
  }

  public async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    const adminUser = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.adminUserProfile)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .leftJoin("user.Account", "Account")
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
      .getOne();

    adminUser.Auth.password = undefined;

    return adminUser;
  }

  public findClientUserInfo(id: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.whenAdminClientUser)
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
      .getOne();
  }
}
