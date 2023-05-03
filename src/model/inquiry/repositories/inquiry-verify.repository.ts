import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class InquiryVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistInquiryRequestId(id: string): Promise<boolean> {
    try {
      const result = await this.inquiryRequestRepository.exist({
        where: { id },
      });
      return result ? true : false;
    } catch (err) {
      this.errorHandlerBuilder
        .setEntity(InquiryRequestEntity)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
