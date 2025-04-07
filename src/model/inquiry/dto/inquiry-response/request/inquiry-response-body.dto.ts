import { ApiProperty, PickType } from "@nestjs/swagger";
import { InquiryResponseEntity } from "../../../entities/inquiry-response.entity";

export class InquiryResponseBody extends PickType(InquiryResponseEntity, [
  "title",
  "content",
  "InquiryResponseImage",
  "InquiryResponseVideo",
] as const) {
  @ApiProperty({
    description: "문의 응답 제목",
    example: "문의 응답 제목 예시",
    required: true,
    uniqueItems: false,
  })
  public title: string;

  @ApiProperty({
    description: "문의 응답 본문",
    example: "문의 응답 본문 예시",
    required: true,
    uniqueItems: false,
  })
  public content: string;
}
