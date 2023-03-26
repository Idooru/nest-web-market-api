import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";

@Injectable()
export class InquiryInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRepository: Repository<InquiryRequestEntity>,
  ) {
    super("Inquiry Insert");
  }

  async findLastCreatedInquiryRequest(): Promise<InquiryRequestEntity> {
    try {
      return await this.inquiryRepository
        .createQueryBuilder()
        .select("inquiryRequest")
        .from(InquiryRequestEntity, "inquiryRequest")
        .orderBy("inquiryRequest.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertInquiryRequestIdOnClientUser(
    clientUser: ClientUserEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryRepository
        .createQueryBuilder()
        .update(InquiryRequestEntity)
        .set({ inquirer: clientUser })
        .where("id = :id", { id: inquiryRequest.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
