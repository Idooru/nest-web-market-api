import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Repository } from "typeorm";

@Injectable()
export class InquiryGeneralRepository {
  constructor(
    @InjectRepository(InquiryEntity)
    private readonly inquiryRepository: Repository<InquiryEntity>,
  ) {}

  async createInquirySample(): Promise<InquiryEntity[]> {
    const inquiry = this.inquiryRepository.create();
    return [await this.inquiryRepository.save(inquiry)];
  }
}
