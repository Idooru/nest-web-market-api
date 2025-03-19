import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const RefreshTokenSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "refresh token",
      description:
        "access token을 재발급 받습니다. access token의 유효기간이 끝났다고 클라이언트에서 판단하면 이 api를 호출 할 수 있도록 합니다. 만약 refresh token의 유효기간이 끝났을 때 이 api를 호출 하면 별도로 logout api를 호출하여 로그아웃이 될 수 있도록 합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiResponse({
      status: 200,
      description: "토큰 재발급 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
  );
};
