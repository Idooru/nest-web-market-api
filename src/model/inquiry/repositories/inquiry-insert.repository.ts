import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";

@Injectable()
export class InquiryInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async findOneInquiryRequestById(id: string): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRequestRepository
        .createQueryBuilder()
        .select("inquiryRequest")
        .from(InquiryRequestEntity, "inquiryRequest")
        .where("inquiryRequest.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneInquiryRequestById.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryRequestEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async findOneInquiryResponseById(id: string): Promise<InquiryResponseEntity> {
    try {
      return await this.inquiryResponseRepository
        .createQueryBuilder()
        .select("inquiryResponse")
        .from(InquiryResponseEntity, "inquiryResponse")
        .where("inquiryResponse.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneInquiryResponseById.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryResponseEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryResponseEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryRequestEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryResponseEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
