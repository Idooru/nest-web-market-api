import { Inject, Injectable } from "@nestjs/common";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquirySelect } from "../../../common/config/repository-select-configs/inquiry.select";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";

@Injectable()
export class InquirySearchRepository {
  constructor(
    @Inject("inquiry-select")
    private readonly select: InquirySelect,
    @InjectRepository(InquiryRequestEntity)
    private readonly repository: Repository<InquiryRequestEntity>,
  ) {}

  public findAllInquiryRequests(id: string): Promise<InquiryRequestEntity[]> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.inquiryRequests)
      .from(InquiryRequestEntity, "inquiryRequest")
      .innerJoin("inquiryRequest.Product", "Product")
      .where("inquiryRequest.InquiryRequester.id = :id", { id })
      .getMany();
  }

  public findInquiryRequest(id: string): Promise<InquiryRequestEntity> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.inquiryRequest)
      .from(InquiryRequestEntity, "inquiryRequest")
      .leftJoin("inquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("inquiryRequest.Video", "InquiryRequestVideo")
      .leftJoin("inquiryRequest.InquiryResponse", "InquiryResponse")
      .leftJoin("InquiryResponse.Image", "InquiryResponseImage")
      .leftJoin("InquiryResponse.Video", "InquiryResponseVideo")
      .innerJoin("inquiryRequest.Product", "Product")
      .where("inquiryRequest.id = :id", { id })
      .getOne();
  }

  public findAllInquiryResponses(id: string): Promise<InquiryResponseEntity[]> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.inquiryResponses)
      .from(InquiryResponseEntity, "inquiryResponse")
      .innerJoin("inquiryResponse.InquiryRequest", "InquiryRequest")
      .innerJoin("InquiryRequest.Product", "Product")
      .where("inquiryResponse.inquiryRespondent.id = :id", { id })
      .getMany();
  }

  public findInquiryResponse(id: string): Promise<InquiryResponseEntity> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.inquiryResponse)
      .from(InquiryResponseEntity, "inquiryResponse")
      .leftJoin("inquiryResponse.Image", "InquiryResponseImage")
      .leftJoin("inquiryResponse.Video", "InquiryResponseVideo")
      .innerJoin("inquiryResponse.InquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .innerJoin("InquiryRequest.Product", "Product")
      .where("inquiryResponse.id = :id", { id })
      .getOne();
  }

  public findInquiryRequestFromAdminProduct(id: string): Promise<InquiryRequestEntity[]> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.inquiryRequestFromAdminProduct)
      .from(InquiryRequestEntity, "inquiryRequest")
      .innerJoin("inquiryRequest.InquiryRequester", "ClientUser")
      .innerJoin("ClientUser.User", "User")
      .innerJoin("User.Auth", "Auth")
      .leftJoin("inquiryRequest.Product", "Product")
      .innerJoin("Product.creator", "AdminUser")
      .groupBy("inquiryRequest.id")
      .where("AdminUser.id = :id", { id })
      .getRawMany();
  }
}
