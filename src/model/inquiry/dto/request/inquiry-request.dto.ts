import { PickType } from "@nestjs/swagger";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class InquiryRequestDto extends PickType(InquiryRequestEntity, [
  "title",
  "content",
  "categories",
  "Image",
  "Video",
] as const) {}
