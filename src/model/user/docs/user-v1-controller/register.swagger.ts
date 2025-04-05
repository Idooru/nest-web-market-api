import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { typeOrmErrorSwagger } from "../../../../common/docs/typeorm-error.swagger";
import { RegisterUserDto } from "../../dto/request/register-user.dto";

export const RegisterSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "register",
      description: "회원 가입을 합니다.",
    }),
    ApiBody({ type: RegisterUserDto, required: true }),
    ApiResponse({
      status: 201,
      description: "회원가입 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "사용자 회원가입을 완료하였습니다.",
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
                timeStamp: "Sun Mar 16 2025 16:05:49 GMT+0900 (Korean Standard Time)",
                reason: {
                  realName: ["realName should not be empty", "realName must be a string"],
                  birth: ["birth should not be empty", "birth must be a valid ISO 8601 date string"],
                  gender: ["gender should not be empty", "gender must be one of the following values: "],
                  phoneNumber: ["phoneNumber should not be empty", "phoneNumber must be a phone number"],
                  address: [
                    "address must be shorter than or equal to 50 characters",
                    "address must be longer than or equal to 10 characters",
                    "address should not be empty",
                    "address must be a string",
                  ],
                  nickName: ["nickName should not be empty", "nickName must be a string"],
                  email: ["email should not be empty", "email must be an email"],
                  password: [
                    "비밀번호 유효성이 어긋납니다. 8자 ~ 30자 사이, 영문 특수 문자 조합을 준수해주세요.",
                    "password should not be empty",
                    "password must be a string",
                  ],
                  role: ["role should not be empty", "role must be one of the following values: "],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            duplication: {
              summary: "입력값 중복",
              description: "이메일, 닉네임, 전화번호가 DB에 있는 것과 중복 될 때",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-16T07:13:34.160Z",
                reason: [
                  "이미 존재하는 user email(gdhong0101@gmail.com)입니다.",
                  "이미 존재하는 user nick name(gdhong)입니다.",
                  "이미 존재하는 user phone number(010-1234-5678)입니다.",
                ],
              },
            },
          },
        },
      },
    }),
    ServerErrorSwagger(typeOrmErrorSwagger),
  );
};
