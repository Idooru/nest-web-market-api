import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { Inject, Injectable } from "@nestjs/common";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InquirySelect } from "../../../common/config/repository-select-configs/inquiry.select";
import { InquiryRequestBasicRawDto } from "../dto/inquiry-request/response/inquiry-request-basic-raw.dto";
import { InquiryRequestDetailRawDto } from "../dto/inquiry-request/response/inquiry-request-detail-raw.dto";
import { InquiryRequestFromAdminProductRawDto } from "../dto/inquiry-request/response/inquiry-request-from-admin-product-raw.dto";
import { FindAllInquiryRequestsDto } from "../dto/inquiry-request/request/find-all-inquiry-requests.dto";

@Injectable()
export class InquiryRequestSearchRepository extends SearchRepository<
  InquiryRequestEntity,
  FindAllInquiryRequestsDto,
  InquiryRequestBasicRawDto
> {
  constructor(
    @Inject("inquiry-select")
    private readonly select: InquirySelect,
    @InjectRepository(InquiryRequestEntity) private readonly repository: Repository<InquiryRequestEntity>,
  ) {
    super();
  }

  private selectInquiryRequest(selects?: string[]): SelectQueryBuilder<InquiryRequestEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(InquiryRequestEntity, "inquiryRequest");
    }
    return queryBuilder.select("inquiryRequest").from(InquiryRequestEntity, "inquiryRequest");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryRequestEntity | InquiryRequestEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryRequest().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<InquiryRequestEntity | InquiryRequestEntity[]> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectInquiryRequest().where(property, alias);
    super.joinEntity(entities, query, "inquiryRequest");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: FindAllInquiryRequestsDto): Promise<InquiryRequestBasicRawDto[]> {
    const { align, column, option, isAnswered, userId } = dto;
    const query = this.selectInquiryRequest(this.select.inquiryRequests)
      .innerJoin("inquiryRequest.Product", "Product")
      .orderBy(`inquiryRequest.${column}`, align)
      .where("inquiryRequest.ClientUser.id = :id", { id: userId })
      .groupBy("inquiryRequest.id");

    if (option) {
      query.andWhere("inquiryRequest.inquiryOption = :inquiryOption", { inquiryOption: option });
    }

    if (isAnswered === "done") {
      query.andWhere("inquiryRequest.isAnswered = :isAnswered", { isAnswered: 1 });
    }

    if (isAnswered === "yet") {
      query.andWhere("inquiryRequest.isAnswered = :isAnswered", { isAnswered: 0 });
    }

    const inquiryRequestRaws = await query.getRawMany();

    return inquiryRequestRaws.map((inquiryRequest) => ({
      inquiryRequest: {
        id: inquiryRequest.inquiryRequestId,
        title: inquiryRequest.inquiryRequestTitle,
        createdAt: inquiryRequest.inquiryRequestCreatedAt,
        option: inquiryRequest.inquiryOption,
        isAnswered: Boolean(inquiryRequest.isAnswered),
      },
      product: {
        id: inquiryRequest.productId,
        name: inquiryRequest.productName,
        price: inquiryRequest.productPrice,
        category: inquiryRequest.productCategory,
      },
    }));
  }

  public async findAllRawsWithProductId(id: string): Promise<InquiryRequestFromAdminProductRawDto[]> {
    const inquiryRequests = await this.selectInquiryRequest(this.select.inquiryRequestFromAdminProduct)
      .innerJoin("inquiryRequest.ClientUser", "ClientUser")
      .innerJoin("ClientUser.User", "User")
      .innerJoin("User.UserAuth", "Auth")
      .leftJoin("inquiryRequest.Product", "Product")
      .innerJoin("Product.AdminUser", "AdminUser")
      .groupBy("inquiryRequest.id")
      .where("AdminUser.id = :id", { id })
      .getRawMany();

    return inquiryRequests.map((inquiryRequest) => ({
      inquiryRequest: {
        id: inquiryRequest.inquiryRequestId,
        title: inquiryRequest.inquiryRequestTitle,
        content: inquiryRequest.inquiryRequestContent,
        option: inquiryRequest.inquiryRequestOption,
        isAnswered: Boolean(inquiryRequest.isAnsweredInquiryRequest),
        createdAt: inquiryRequest.inquiryRequestCreatedAt,
      },
      inquiryRequester: {
        id: inquiryRequest.inquiryRequesterId,
        role: inquiryRequest.inquiryRequesterRole,
        email: inquiryRequest.inquiryRequesterEmail,
        nickName: inquiryRequest.inquiryRequesterNickName,
      },
      product: {
        id: inquiryRequest.productId,
        name: inquiryRequest.productName,
        price: parseInt(inquiryRequest.productPrice),
        category: inquiryRequest.productCategory,
      },
    }));
  }

  public async findDetailRaw(id: string): Promise<InquiryRequestDetailRawDto> {
    const inquiryRequest = await this.selectInquiryRequest(this.select.inquiryRequest)
      .leftJoin("inquiryRequest.InquiryRequestImage", "InquiryRequestImage")
      .leftJoin("inquiryRequest.InquiryRequestVideo", "InquiryRequestVideo")
      .leftJoin("inquiryRequest.InquiryResponse", "InquiryResponse")
      .leftJoin("InquiryResponse.InquiryResponseImage", "InquiryResponseImage")
      .leftJoin("InquiryResponse.InquiryResponseVideo", "InquiryResponseVideo")
      .innerJoin("inquiryRequest.Product", "Product")
      .where("inquiryRequest.id = :id", { id })
      .getOne();

    return {
      inquiryRequest: {
        id: inquiryRequest.id,
        title: inquiryRequest.title,
        content: inquiryRequest.content,
        option: inquiryRequest.inquiryOption,
        isAnswered: inquiryRequest.isAnswered,
        imageUrls: inquiryRequest.InquiryRequestImage.map((image) => image.url),
        videoUrls: inquiryRequest.InquiryRequestVideo.map((video) => video.url),
      },
      inquiryResponse: inquiryRequest.InquiryResponse
        ? {
            id: inquiryRequest.InquiryResponse.id,
            title: inquiryRequest.InquiryResponse.title,
            content: inquiryRequest.InquiryResponse.content,
            imageUrls: inquiryRequest.InquiryResponse.InquiryResponseImage.map((image) => image.url),
            videoUrls: inquiryRequest.InquiryResponse.InquiryResponseVideo.map((video) => video.url),
          }
        : null,
      product: {
        id: inquiryRequest.Product.id,
        name: inquiryRequest.Product.name,
        price: inquiryRequest.Product.price,
        category: inquiryRequest.Product.category,
      },
    };
  }
}

// inquiryRequestId: inquiryRequest.id,
//   inquiryRequestTitle: inquiryRequest.title,
//   inquiryRequestContent: inquiryRequest.content,
//   inquiryOption: inquiryRequest.inquiryOption,
//   isAnswered: Boolean(inquiryRequest.isAnswered),
//   inquiryRequestImageUrls: inquiryRequest.InquiryRequestImage.map((image) => image.url),
//   inquiryRequestVideoUrls: inquiryRequest.InquiryRequestVideo.map((video) => video.url),
//   inquiryResponseId: inquiryRequest.InquiryResponse.id,
//   inquiryResponseTitle: inquiryRequest.InquiryResponse.title,
//   inquiryResponseContent: inquiryRequest.InquiryResponse.content,
//   inquiryResponseImageUrls: inquiryRequest.InquiryResponse.InquiryResponseImage.map((image) => image.url),
//   inquiryResponseVideoUrls: inquiryRequest.InquiryResponse.InquiryResponseVideo.map((video) => video.url),
//   productId: inquiryRequest.Product.id,
//   productName: inquiryRequest.Product.name,
//   productPrice: inquiryRequest.Product.price,
//   productCategory: inquiryRequest.Product.category,
