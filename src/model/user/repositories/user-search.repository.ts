import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { UserSelect } from "src/common/config/repository-select-configs/user.select";
import { UserProfileRawDto } from "../dto/response/user-profile-raw.dto";
import { MediaUtils } from "../../media/logic/media.utils";
import { ClientUserRawDto } from "../dto/response/client-user-raw.dto";
import { UserBasicRawDto } from "../dto/response/user-basic-raw.dto";
import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllUsersDto } from "../dto/request/find-all-users.dto";

@Injectable()
export class UserSearchRepository extends SearchRepository<UserEntity, FindAllUsersDto, UserBasicRawDto> {
  constructor(
    @Inject("user-select")
    private readonly select: UserSelect,
    @Inject("user-id-filter")
    private readonly userIdFilter: string,
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly utils: MediaUtils,
  ) {
    super();
  }

  private selectUser(selects?: string[]): SelectQueryBuilder<UserEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(UserEntity, "user");
    }
    return queryBuilder.select("user").from(UserEntity, "user");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<UserEntity | UserEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectUser().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<UserEntity | UserEntity[]> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectUser().where(property, alias);
    super.joinEntity(entities, query, "user");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: FindAllUsersDto): Promise<UserBasicRawDto[]> {
    const { align, column } = dto;
    const userColumns = ["createdAt", "role"];
    const userAuthColumns = ["email", "nickName"];

    const query = this.selectUser(this.select.users).innerJoin("user.UserAuth", "Auth").groupBy("user.id");

    if (userColumns.includes(column)) {
      query.orderBy(`user.${column}`, align);
    }

    if (userAuthColumns.includes(column)) {
      query.orderBy(`Auth.${column}`, align);
    }

    const userRows = await query.getRawMany();

    return userRows.map((user) => ({
      id: user.userId,
      role: user.role,
      email: user.email,
      nickName: user.nickName,
      createdAt: user.createdAt,
    }));
  }

  public async findUserProfileRaw(id: string): Promise<UserProfileRawDto> {
    const user = await this.selectUser(this.select.profile)
      .innerJoin("user.UserProfile", "Profile")
      .innerJoin("user.UserAuth", "Auth")
      .where(this.userIdFilter, { id })
      .getRawOne();

    return {
      id: user.id,
      role: user.role,
      realName: user.realName,
      birth: user.birth,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      address: user.address,
      nickName: user.nickName,
      email: user.email,
    };
  }

  public async findClientUserRaw(id: string): Promise<ClientUserRawDto> {
    const user = await this.selectUser(this.select.whenAdminClientUser)
      .innerJoin("user.UserProfile", "Profile")
      .innerJoin("user.UserAuth", "Auth")
      .innerJoin("user.ClientUser", "Client")
      .leftJoin("Client.Payment", "Payment")
      .leftJoin("Payment.Product", "Product")
      .leftJoin("Product.ProductImage", "ProductImage")
      .leftJoin("Client.Review", "Review")
      .leftJoin("Review.ReviewImage", "ReviewImage")
      .leftJoin("Review.ReviewVideo", "ReviewVideo")
      .leftJoin("Client.InquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.InquiryRequestImage", "InquiryRequestImage")
      .leftJoin("InquiryRequest.InquiryRequestVideo", "InquiryRequestVideo")
      .where(this.userIdFilter, { id })
      .getOne();

    return {
      user: {
        id: user.id,
        role: user.role,
        realName: user.UserProfile.realName,
        phoneNumber: user.UserProfile.phoneNumber,
        email: user.UserAuth.email,
      },
      payments: user.ClientUser.Payment.map((payment) => ({
        id: payment.id,
        quantity: payment.quantity,
        totalPrice: payment.totalPrice,
        product: payment.Product
          ? {
              id: payment.Product.id,
              name: payment.Product.name,
              price: payment.Product.price,
              origin: payment.Product.origin,
              category: payment.Product.category,
              imageUrls: (() =>
                payment.Product.ProductImage.length
                  ? payment.Product.ProductImage.map((image) => image.url)
                  : [this.utils.setUrl("default_product_image.jpg", "product/images")])(),
            }
          : null,
      })),
      reviews: user.ClientUser.Review.map((review) => ({
        id: review.id,
        title: review.title,
        content: review.content,
        starRateScore: review.starRateScore,
        countForModify: review.countForModify,
        imageUrls: review.ReviewImage.map((image) => image.url),
        videoUrls: review.ReviewVideo.map((video) => video.url),
      })),
      inquiryRequests: user.ClientUser.InquiryRequest.map((inquiryRequest) => ({
        id: inquiryRequest.id,
        title: inquiryRequest.title,
        content: inquiryRequest.content,
        inquiryOption: inquiryRequest.inquiryOption,
        isAnswered: inquiryRequest.isAnswered,
        imageUrls: inquiryRequest.InquiryRequestImage.map((image) => image.url),
        videoUrls: inquiryRequest.InquiryRequestVideo.map((video) => video.url),
      })),
    };
  }
}
