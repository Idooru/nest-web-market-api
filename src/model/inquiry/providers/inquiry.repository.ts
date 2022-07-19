import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiriesEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Repository } from "typeorm";

@Injectable()
export class InquiryRepository {
  constructor(
    @InjectRepository(InquiriesEntity)
    private readonly inquiryRepository: Repository<InquiriesEntity>,
  ) {}

  async createInquirySample(): Promise<InquiriesEntity[]> {
    const inquiry = this.inquiryRepository.create();
    return [await this.inquiryRepository.save(inquiry)];
  }
}
