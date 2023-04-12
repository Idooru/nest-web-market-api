import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { Repository } from "typeorm";
import { CreateInquiryRequestDao } from "../dto/request/create-inquiry-request.dto";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseDto } from "../dto/response/inquiry-response.dto";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";
import { InquirySelectProperty } from "src/common/config/repository-select-configs/inquiry.select";

@Injectable()
export class InquiryGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
    @Inject("InquirySelectProperty")
    private readonly select: InquirySelectProperty,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder<unknown>,
  ) {
    super();
  }

  async createInquiryRequest(
    createInquiryDao: CreateInquiryRequestDao,
  ): Promise<void> {
    try {
      const { inquiryRequestDto, client, product } = createInquiryDao;
      await this.inquiryRequestRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryRequestEntity)
        .values({
          ...inquiryRequestDto,
          Product: product,
          inquiryRequestWritter: client,
        })
        .execute();
    } catch (err) {
      this.methodName = this.createInquiryRequest.name;
      this.errorHandlerBuilder
        .setEntity(new InquiryRequestEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async createInquiryResponse(
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void> {
    try {
      await this.inquiryResponseRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryResponseEntity)
        .values({ ...inquiryResponseDto })
        .execute();
    } catch (err) {
      this.methodName = this.createInquiryResponse.name;
      this.errorHandlerBuilder
        .setEntity(new InquiryRequestEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findInquiryRequestWithId(id: string): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRequestRepository
        .createQueryBuilder()
        .select(this.select.inquiryRequest)
        .from(InquiryRequestEntity, "inquiryRequest")
        .innerJoin("inquiryRequest.Product", "Product")
        .where("inquiryRequest.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryRequestWithId.name;
      this.errorHandlerBuilder
        .setEntity(new InquiryRequestEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async setIsAnsweredTrue(inquiryRequest: InquiryRequestEntity): Promise<void> {
    try {
      await this.inquiryRequestRepository
        .createQueryBuilder()
        .update(InquiryRequestEntity)
        .set({ isAnswerd: true })
        .where("id = :id", { id: inquiryRequest.id })
        .execute();
    } catch (err) {
      this.methodName = this.setIsAnsweredTrue.name;
      this.errorHandlerBuilder
        .setEntity(new InquiryRequestEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
