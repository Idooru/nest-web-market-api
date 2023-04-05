import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { Repository } from "typeorm";
import { CreateInquiryRequestDao } from "../dto/request/create-inquiry-request.dto";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseDto } from "../dto/response/inquiry-response.dto";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class InquiryGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
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
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<InquiryResponseEntity>(
        new InquiryResponseEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async findInquiryRequestWithId(id: string): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRequestRepository
        .createQueryBuilder()
        .select(["inquiryRequest", "Product"])
        .from(InquiryRequestEntity, "inquiryRequest")
        .innerJoin("inquiryRequest.Product", "Product")
        .where("inquiryRequest.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryRequestWithId.name;
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
