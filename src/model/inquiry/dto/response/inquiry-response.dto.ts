import { PickType } from "@nestjs/swagger";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";

export class InquiryResponseDto extends PickType(InquiryResponseEntity, [
  "title",
  "content",
  "categories",
  "Image",
  "Video",
] as const) {}
