import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Repository } from "typeorm";

@Injectable()
export class InquiryGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepository: Repository<InquiryEntity>,
  ) {
    super();
  }

  async createInquirySample(): Promise<InquiryEntity[]> {
    const inquiry = this.inquiryRepository.create();
    return [await this.inquiryRepository.save(inquiry)];
  }
}
