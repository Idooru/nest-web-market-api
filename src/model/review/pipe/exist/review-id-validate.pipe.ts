import { Injectable, PipeTransform } from "@nestjs/common";
import { ReviewValidator } from "../../logic/review.validator";

@Injectable()
export class ReviewIdValidatePipe implements PipeTransform {
  constructor(private readonly reviewValidator: ReviewValidator) {}

  public async transform(id: string): Promise<string> {
    await this.reviewValidator.isExistId(id);

    return id;
  }
}
