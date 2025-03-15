import { Injectable } from "@nestjs/common";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";
import { InquiryValidateRepository } from "../repositories/inquiry-validate.repository";

@Injectable()
export class InquiryValidator {
  constructor(
    private readonly inquiryValidateRepository: InquiryValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  public async isExistRequestId(id: string): Promise<void> {
    const result = await this.inquiryValidateRepository.validateRequestId(id);
    this.validateLibrary.isExistData(result, "inquiry request id", id);
  }

  public async isExistResponseId(id: string): Promise<void> {
    const result = await this.inquiryValidateRepository.validateResponseId(id);
    this.validateLibrary.isExistData(result, "inquiry response id", id);
  }
}
