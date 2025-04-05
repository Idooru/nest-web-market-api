import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { ModifyUserEmailDto } from "../../dto/request/modify-user-email.dto";

export const ModifyUserEmailSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "modify user email",
      description: "본인의 사용자 이메일 column을 수정합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiBody({ type: ModifyUserEmailDto, required: true }),
    ApiResponse({
      status: 201,
      description: "사용자 이메일 수정 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "사용자의 이메일을 수정합니다.",
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
              description: "이메일을 제외하고 요쳥을 보낼 시",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Sun Mar 16 2025 20:54:49 GMT+0900 (Korean Standard Time)",
                reason: {
                  email: ["email should not be empty", "email must be an email"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            duplication: {
              summary: "입력값 중복",
              description: "이메일이 DB에 있는 것과 중복 될 때",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-16T11:56:42.986Z",
                reason: "이미 존재하는 user email(gdhong0101@gmail.com)입니다.",
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
