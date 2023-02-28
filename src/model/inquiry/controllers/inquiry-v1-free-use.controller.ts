import { Controller } from "@nestjs/common";
import { InquiryGeneralService } from "../services/inquiry-general.service";

@Controller("/api/v1/free-use/inquiry")
export class InquiryVersionOneFreeUseController {
  constructor(private readonly inquiryService: InquiryGeneralService) {}
}
