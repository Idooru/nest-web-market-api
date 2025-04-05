import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { ModifyUserPasswordDto } from "../../dto/request/modify-user-password.dto";

export const ModifyUserPasswordSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "modify user password",
      description: "본인의 사용자 비밀번호 column을 수정합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiBody({ type: ModifyUserPasswordDto, required: true }),
    ApiResponse({
      status: 201,
      description: "사용자 비밀번호 수정 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "사용자의 비밀번호를 수정합니다.",
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
              summary: "입력값 부재",
              description: "비밀번호를 제외하고 요청을 보낼 시",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Sun Mar 16 2025 21:27:09 GMT+0900 (Korean Standard Time)",
                reason: {
                  password: [
                    "비밀번호 유효성이 어긋납니다. 8자 ~ 30자 사이, 영문 특수 문자 조합을 준수해주세요.",
                    "password should not be empty",
                    "password must be a string",
                  ],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            invalidInput: {
              summary: "유효성 부적합",
              description: "비밀번호 유효성이 부적합 할 때 (8자 ~ 30자 사이, 영문 특수 문자 조합 준수 필요)",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Sun Mar 16 2025 21:32:20 GMT+0900 (Korean Standard Time)",
                reason: {
                  password: ["비밀번호 유효성이 어긋납니다. 8자 ~ 30자 사이, 영문 특수 문자 조합을 준수해주세요."],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
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
