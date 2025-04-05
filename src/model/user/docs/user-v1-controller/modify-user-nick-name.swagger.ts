import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { ModifyUserNicknameDto } from "../../dto/request/modify-user-nickname.dto";

export const ModifyUserNickNameSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "modify user nickName",
      description: "본인의 사용자 닉네임 column을 수정합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiBody({ type: ModifyUserNicknameDto, required: true }),
    ApiResponse({
      status: 201,
      description: "사용자 닉네임 수정 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "사용자의 닉네임을 수정합니다.",
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
              description: "닉네임을 제외하고 요청을 보낼 시",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Sun Mar 16 2025 21:06:11 GMT+0900 (Korean Standard Time)",
                reason: {
                  nickName: ["nickName should not be empty", "nickName must be a string"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            duplication: {
              summary: "입력값 중복",
              description: "닉네임이 DB에 있는 것과 중복 될 때",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-16T12:08:52.242Z",
                reason: "이미 존재하는 user nick name(gdhong2)입니다.",
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
