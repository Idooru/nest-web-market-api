import { Injectable, PipeTransform } from "@nestjs/common";
import { InquiryValidator } from "../../logic/inquiry.validator";

@Injectable()
export class InquiryRequestIdValidatePipe implements PipeTransform {
  constructor(private readonly inquiryValidator: InquiryValidator) {}

  public async transform(id: string): Promise<string> {
    await this.inquiryValidator.isExistRequestId(id);

    return id;
  }
}
