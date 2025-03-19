import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const SecessionSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: "secession", description: "회원 탈퇴를 합니다." }),
    JwtAuthHeaderSwagger(),
    ApiResponse({
      status: 200,
      description: "회원 탈퇴 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "사용자 정보를 삭제하였습니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
  );
};
