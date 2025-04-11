import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { typeOrmErrorSwagger } from "../../../../common/docs/typeorm-error.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { BasicAuthDto } from "../../dto/request/basic-auth.dto";

export const LoginSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "login",
      description: "로그인을 합니다. 성공시 access token을 request header에 담고 refresh token을 DB에 저장합니다.",
    }),
    ApiBody({ type: BasicAuthDto, required: true }),
    ApiResponse({
      status: 201,
      description: "로그인 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
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
              description: "필요한 입력값을 제외하고 요청을 보낼시",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Sun Mar 16 2025 19:39:45 GMT+0900 (Korean Standard Time)",
                reason: {
                  email: ["email should not be empty", "email must be an email"],
                  password: [
                    "비밀번호 유효성이 어긋납니다. 8자 ~ 30자 사이, 영문 특수 문자 조합을 준수해주세요.",
                    "password should not be empty",
                    "password must be a string",
                  ],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            incorrectInput: {
              summary: "입력값 불일치",
              description: "입력한 이메일과 비밀번호가 같은 사용자의 것이 아닐 때",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-16T10:44:02.137Z",
                reason: "아이디 혹은 비밀번호가 일치하지 않습니다.",
              },
            },
          },
        },
      },
    }),
    ServerErrorSwagger(typeOrmErrorSwagger),
  );
};
