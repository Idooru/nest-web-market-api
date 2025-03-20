import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const LogoutSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "logout",
      description: "로그아웃을 합니다. access token이 담긴 request header와 db에 저장된 refresh token을 제거합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiResponse({
      status: 200,
      description: "로그아웃 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "로그아웃을 완료하였습니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
  );
};
