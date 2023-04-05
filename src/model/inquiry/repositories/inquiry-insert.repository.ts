import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class InquiryInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
  ) {
    super();
  }

  async findLastCreatedInquiryRequest(): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRequestRepository
        .createQueryBuilder()
        .select("inquiryRequest")
        .from(InquiryRequestEntity, "inquiryRequest")
        .orderBy("inquiryRequest.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.methodName = this.findLastCreatedInquiryRequest.name;
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async findLastCreatedInquiryResponse(): Promise<InquiryResponseEntity> {
    try {
      return await this.inquiryResponseRepository
        .createQueryBuilder()
        .select("inquiryResponse")
        .from(InquiryResponseEntity, "inquiryResponse")
        .orderBy("inquiryResponse.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.methodName = this.findLastCreatedInquiryResponse.name;
      this.repositoryErrorHandler.init<InquiryResponseEntity>(
        new InquiryResponseEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async insertInquiryRequestIdOnInquiryResponse(
    inquiryRequest: InquiryRequestEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    try {
      await this.inquiryResponseRepository
        .createQueryBuilder()
        .update(InquiryResponseEntity)
        .set({ InquiryRequest: inquiryRequest })
        .where("id = :id", { id: inquiryResponse.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertInquiryRequestIdOnInquiryResponse.name;
      this.repositoryErrorHandler.init<InquiryResponseEntity>(
        new InquiryResponseEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async insertClientUserIdOnInquiryRequest(
    clientUser: ClientUserEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryRequestRepository
        .createQueryBuilder()
        .update(InquiryRequestEntity)
        .set({ inquiryRequestWritter: clientUser })
        .where("id = :id", { id: inquiryRequest.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertClientUserIdOnInquiryRequest.name;
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async insertAdminUserIdOnInquiryResponse(
    adminUser: AdminUserEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    try {
      await this.inquiryResponseRepository
        .createQueryBuilder()
        .update(InquiryResponseEntity)
        .set({ inquiryResponseWritter: adminUser })
        .where("id = :id", { id: inquiryResponse.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertAdminUserIdOnInquiryResponse.name;
      this.repositoryErrorHandler.init<InquiryResponseEntity>(
        new InquiryResponseEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
