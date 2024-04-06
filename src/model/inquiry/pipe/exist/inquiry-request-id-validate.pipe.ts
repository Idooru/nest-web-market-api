import { Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { InquiryValidator } from "../../logic/inquiry.validator";

@Injectable()
export class InquiryRequestIdValidatePipe implements PipeTransform {
  constructor(private readonly inquiryValidator: InquiryValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.inquiryValidator.isExistRequestId(id);

    return id;
  }
}
