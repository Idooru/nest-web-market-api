import { ApiProperty, PickType } from "@nestjs/swagger";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class InquiryRequestBodyDto extends PickType(InquiryRequestEntity, [
  "title",
  "content",
  "categories",
  "Image",
  "Video",
] as const) {
  @ApiProperty({
    description: "문의 요청 제목",
    example: "문의 요청 제목 예시",
    required: true,
    uniqueItems: false,
  })
  title: string;

  @ApiProperty({
    description: "문의 요청 본문",
    example: "문의 요청 본문 예시",
    required: true,
    uniqueItems: false,
  })
  content: string;

  @ApiProperty({
    description: "문의 요청 카테고리",
    example: "product status",
    required: true,
    uniqueItems: false,
  })
  categories: "product status" | "delivery status";
}
