import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class InquiryVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
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
      this.repositoryErrorHandler.init<InquiryRequestEntity>(
        new InquiryRequestEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
