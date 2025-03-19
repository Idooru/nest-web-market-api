import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const FindForgottenEmailSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find email",
      description: "잃어버린 이메일을 찾습니다. 본인 인증을 하기 위해서 실명과 전화번호를 사용합니다.",
    }),
    ApiResponse({
      status: 200,
      description: "이메일 찾기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "이메일 정보를 가져옵니다.",
            result: "gdhong0101@gmail.com",
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      content: {
        "application/json": {
          examples: {
            noInput: {
              summary: "입력값 부재로 인한 실패",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Mon Mar 17 2025 11:44:30 GMT+0900 (Korean Standard Time)",
                reason: {
                  realName: ["realName should not be empty", "realName must be a string"],
                  phoneNumber: ["phoneNumber should not be empty", "phoneNumber must be a phone number"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            noDataInDB: {
              summary: "DB에 입력값 없음",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-17T02:44:47.638Z",
                reason: "입력한 실명과 전화번호가 일치하지 않는 사용자입니다.",
              },
            },
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
  );
};
