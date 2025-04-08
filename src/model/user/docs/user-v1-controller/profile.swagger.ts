import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const ProfileSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "get my profile",
      description: "본인의 프로필 정보를 가져옵니다. 본인 계정의 권한에 해당되는 정보를 가져옵니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiResponse({
      status: 200,
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "사용자 정보를 가져옵니다.",
            result: {
              id: "6c14f98e-3fa0-4178-ae68-12d9db142ae6",
              role: "client",
              realName: "홍길동",
              birth: "2001-01-01T00:00:00.000Z",
              gender: "male",
              phoneNumber: "010-1234-5678",
              address: "(본인 주소지)",
              nickName: "gdhong",
              email: "gdhong0101@gmail.com",
            },
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
  );
};
