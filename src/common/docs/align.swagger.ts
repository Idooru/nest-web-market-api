import { ApiQuery } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const AlignSwagger = () => {
  return applyDecorators(
    ApiQuery({
      name: "align",
      required: false,
      enum: ["DESC", "ASC"],
      description: "column을 기준으로 오름차순 혹은 내림차순으로 정렬합니다.",
      example: "/all?align=DESC",
    }),
  );
};
