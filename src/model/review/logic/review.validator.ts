import { Injectable } from "@nestjs/common";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";
import { ReviewValidateRepository } from "../repositories/review-validate.repository";

@Injectable()
export class ReviewValidator {
  constructor(
    private readonly reviewValidateRepository: ReviewValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async isExistId(id: string): Promise<void> {
    const result = await this.reviewValidateRepository.isExistId(id);
    this.validateLibrary.isExistData(result, "id", id);
  }
}
