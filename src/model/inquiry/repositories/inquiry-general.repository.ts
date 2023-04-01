import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { Repository } from "typeorm";
import { CreateInquiryRequestDao } from "../dto/request/create-inquiry-request.dto";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseDto } from "../dto/response/inquiry-response.dto";

@Injectable()
export class InquiryGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
  ) {
    super("Inquiry General");
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findInquiryRequestWithId(
    inquiryRequestId: string,
  ): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRequestRepository
        .createQueryBuilder()
        .select(["inquiryRequest", "Product"])
        .from(InquiryRequestEntity, "inquiryRequest")
        .innerJoin("inquiryRequest.Product", "Product")
        .where("inquiryRequest.id = :id", { id: inquiryRequestId })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async setIsAnsweredTrue(inquiryRequest: InquiryRequestEntity): Promise<void> {
    try {
      await this.inquiryRequestRepository
        .createQueryBuilder()
        .update()
        .set({ isAnswerd: true })
        .where("id = :id", { id: inquiryRequest.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
