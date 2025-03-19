import { ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export const ServerErrorSwagger = (typeOrmError?: any) => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      content: {
        "application/json": {
          examples: {
            serverError: {
              summary: "서버 에러",
              description: "서버 애플리케이션 내에 handling 되지 못한 exception 입니다.",
              value: {
                statusCode: 500,
                message: "Internal server error",
              },
            },
            typeOrmError,
          },
        },
      },
    }),
  );
};
