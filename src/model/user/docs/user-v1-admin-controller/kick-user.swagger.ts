import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { UuidParamSwagger } from "../../../../common/docs/uuid-param.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { IsNotAdminSwagger } from "../../../auth/docs/is-not-admin.swagger";

export const KickUserSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "kick user",
      description: "사용자의 아이디에 해당하는 사용자를 추방합니다.",
    }),
    JwtAuthHeaderSwagger(),
    UuidParamSwagger({ name: "userId", descriptionName: "사용자 아이디" }),
    ApiResponse({
      status: 200,
      description: "고객 사용자 추방하기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "da2607fe-e127-410c-98b5-69a3ec8b92b4에 해당하는 사용자를 추방합니다.",
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: "파라미터로 넘긴 사용자 아이디가 DB에 없을 경우",
      content: {
        "application/json": {
          example: {
            success: false,
            error: "NotFoundException",
            statusCode: 404,
            timeStamp: "2025-03-17T04:26:39.464Z",
            reason: "존재하지 않은 user id(da2607fe-e127-410c-98b5-69a3ec8b92b3)입니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
    IsNotAdminSwagger(),
  );
};
