import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Repository } from "typeorm";
import { CreateInquiryDao } from "../dto/create-inquiry.dto";

@Injectable()
export class InquiryGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepository: Repository<InquiryEntity>,
  ) {
    super("Inquiry General");
  }

  async createInquiry(createInquiryDao: CreateInquiryDao): Promise<void> {
    try {
      const { inquiryRequestDto, client, product } = createInquiryDao;
      await this.inquiryRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryEntity)
        .values({ ...inquiryRequestDto, Product: product, inquirer: client })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedOneInquiryWithUserId(
    clientUserId: string,
  ): Promise<InquiryEntity> {
    try {
      return await this.inquiryRepository
        .createQueryBuilder()
        .select("inquiry")
        .from(InquiryEntity, "inquiry")
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
