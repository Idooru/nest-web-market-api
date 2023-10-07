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
    const result = await this.inquiryValidateRepository.isExistRequestId(id);
    this.validateLibrary.isExistData(result, "id", id);
  }
}
