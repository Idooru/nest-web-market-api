import { ApiProperty, PickType } from "@nestjs/swagger";
import { InquiryRequestEntity } from "../../../entities/inquiry-request.entity";
import { InquiryOption } from "../../../types/inquiry-option.type";

export class InquiryRequestBody extends PickType(InquiryRequestEntity, [
  "title",
  "content",
  "inquiryOption",
  "InquiryRequestImage",
  "InquiryRequestVideo",
] as const) {
  @ApiProperty({
    description: "문의 요청 제목",
    example: "문의 요청 제목 예시",
    required: true,
    uniqueItems: false,
  })
  public title: string;

  @ApiProperty({
    description: "문의 요청 본문",
    example: "문의 요청 본문 예시",
    required: true,
    uniqueItems: false,
  })
  public content: string;

  @ApiProperty({
    description: "문의 요청 카테고리",
    example: "product status",
    required: true,
    uniqueItems: false,
  })
  public inquiryOption: InquiryOption;
}
