import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export const IsNotAdminSwagger = () => {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: "로그인한 사용자가 관리자가 아닐 경우 발생합니다.",
      content: {
        "application/json": {
          example: {
            success: false,
            error: "ForbiddenException",
            statusCode: 403,
            timeStamp: "2025-03-17T03:56:24.651Z",
            reason: "admin 계정만 수행 할 수 있는 작업입니다.",
          },
        },
      },
    }),
  );
};
