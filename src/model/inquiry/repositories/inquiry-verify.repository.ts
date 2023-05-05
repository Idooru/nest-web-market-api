import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder.builder";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";

@Injectable()
export class InquiryVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,

    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
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
      this.typeOrmErrorHandlerBuilder
        .setEntity(InquiryRequestEntity)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
