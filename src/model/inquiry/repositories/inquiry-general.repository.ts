import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { Repository } from "typeorm";
import { CreateInquiryRequestDao } from "../dto/request/create-inquiry-request.dto";

@Injectable()
export class InquiryGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRepository: Repository<InquiryRequestEntity>,
  ) {
    super("Inquiry General");
  }

  async createInquiryRequest(
    createInquiryDao: CreateInquiryRequestDao,
  ): Promise<void> {
    try {
      const { createInquiryRequestDto, client, product } = createInquiryDao;
      await this.inquiryRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryRequestEntity)
        .values({
          ...createInquiryRequestDto,
          Product: product,
          inquirer: client,
        })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedOneInquiryRequestWithUserId(
    clientUserId: string,
  ): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRepository
        .createQueryBuilder()
        .select("inquiryRequest")
        .from(InquiryRequestEntity, "inquiryRequest")
        .where("inquiryRequest.inquirer = :id", { id: clientUserId })
        .orderBy("inquiryRequest.createdAt", "DESC")
        .limit(1)
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
