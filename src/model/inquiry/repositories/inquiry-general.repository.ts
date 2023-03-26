import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { RequestInquiryEntity } from "src/model/inquiry/entities/request-inquiry.entity";
import { Repository } from "typeorm";
import { CreateInquiryDao } from "../dto/create-inquiry.dto";

@Injectable()
export class InquiryGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(RequestInquiryEntity)
    private readonly inquiryRepository: Repository<RequestInquiryEntity>,
  ) {
    super("Inquiry General");
  }

  async createInquiry(createInquiryDao: CreateInquiryDao): Promise<void> {
    try {
      const { inquiryRequestDto, client, product } = createInquiryDao;
      await this.inquiryRepository
        .createQueryBuilder()
        .insert()
        .into(RequestInquiryEntity)
        .values({ ...inquiryRequestDto, Product: product, inquirer: client })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedOneInquiryWithUserId(
    clientUserId: string,
  ): Promise<RequestInquiryEntity> {
    try {
      return await this.inquiryRepository
        .createQueryBuilder()
        .select("inquiry")
        .from(RequestInquiryEntity, "inquiry")
        .where("inquiry.inquirer = :id", { id: clientUserId })
        .orderBy("inquiry.createdAt", "DESC")
        .limit(1)
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
