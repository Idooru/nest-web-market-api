import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { Repository } from "typeorm";

@Injectable()
export class InquiryValidateRepository {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
  ) {}

  public async isExistRequestId(id: string): Promise<boolean> {
    return await this.inquiryRequestRepository.exist({ where: { id } });
  }
}
