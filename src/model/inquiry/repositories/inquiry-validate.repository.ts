import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { Repository } from "typeorm";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";

@Injectable()
export class InquiryValidateRepository {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @InjectRepository(InquiryResponseEntity)
    private readonly inquiryResponseRepository: Repository<InquiryResponseEntity>,
  ) {}

  public validateRequestId(id: string): Promise<boolean> {
    return this.inquiryRequestRepository.exist({ where: { id } });
  }

  public validateResponseId(id: string): Promise<boolean> {
    return this.inquiryResponseRepository.exist({ where: { id } });
  }
}
