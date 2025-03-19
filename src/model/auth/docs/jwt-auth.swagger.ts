import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiResponse } from "@nestjs/swagger";

export const JwtAuthHeaderSwagger = () => {
  return applyDecorators(
    ApiHeader({
      name: "access-token",
      description: "jwt 인증 토큰입니다. 반드시 jwt 형식이어야 합니다.",
      required: true,
    }),
  );
};

export const JwtAuthFailSwagger = () => {
  return applyDecorators(
    ApiResponse({
      status: 401,
      content: {
        "application/json": {
          examples: {
            noAccessToken: {
              summary: "Access Token 부재",
              description: "request header에 access-token필드를 제외하고 요청을 보낼 시",
              value: {
                success: false,
                error: "UnauthorizedException",
                statusCode: 401,
                timeStamp: "2025-03-16T09:51:22.250Z",
                reason: "access-token이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.",
              },
            },
            invalidAccessToken: {
              summary: "Access Token 변조 문제",
              description: "access-token의 값 중 header 혹은 signature가 변조 되었을 시",
              value: {
                success: false,
                error: "JsonWebTokenError",
                statusCode: 401,
                timeStamp: "Sun Mar 16 2025 18:51:55 GMT+0900 (Korean Standard Time)",
                message: "변조된 access-token 입니다.",
              },
            },
            tokenSyntax: {
              summary: "Token Payload 변조 문제",
              description: "access-token의 값 중 payload가 변조 되었을 시",
              value: {
                success: false,
                error: "SyntaxError",
                statusCode: 401,
                timeStamp: "Sun Mar 16 2025 18:52:44 GMT+0900 (Korean Standard Time)",
                message: "변조된 jwt payload 입니다.",
              },
            },
            expiredAccessToken: {
              summary: "Access Token 만료",
              description: "access-token의 유효시간이 만료되었을 시",
              value: {
                success: false,
                error: "TokenExpiredError",
                statusCode: 401,
                timeStamp: "Sun Mar 16 2025 18:51:03 GMT+0900 (Korean Standard Time)",
                message: "access-token이 만료되었습니다. 토큰을 재발급 받으세요.",
              },
            },
          },
        },
      },
    }),
  );
};
