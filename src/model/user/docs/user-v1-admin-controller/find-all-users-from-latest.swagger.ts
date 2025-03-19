import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swager";
import { IsNotAdminSwagger } from "../../../auth/docs/is-not-admin.swagger";

export const FindAllUsersFromLatestSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find all users from latest",
      description: "전체 사용자 정보를 최신 순서로 가져옵니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiResponse({
      status: 200,
      description: "전체 사용자 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "전체 사용자 정보를 최신 순서로 가져옵니다.",
            result: [
              {
                userId: "da2607fe-e127-410c-98b5-69a3ec8b92b4",
                role: "client",
                nickName: "gdhong",
                email: "gdhong0101@gmail.com",
                createdAt: "2025-03-17T02:41:46.254Z",
              },
              {
                userId: "dae9d3c5-10a1-4abd-a2ce-79b17ce5b624",
                role: "client",
                nickName: "shchoi",
                email: "shere1765@naver.com",
                createdAt: "2025-03-11T07:17:56.625Z",
              },
              {
                userId: "9eb4d805-dc62-4477-955b-af9f11d11d16",
                role: "client",
                nickName: "shpark",
                email: "shere1767@gmail.com",
                createdAt: "2025-03-03T11:17:35.210Z",
              },
              {
                userId: "286967b7-9fb5-4fe6-822c-d595777f8cc4",
                role: "admin",
                nickName: "shkim",
                email: "shere1766@gmail.com",
                createdAt: "2025-03-03T10:08:22.734Z",
              },
              {
                userId: "6c14f98e-3fa0-4178-ae68-12d9db142ae6",
                role: "admin",
                nickName: "shlee",
                email: "shere1765@gmail.com",
                createdAt: "2025-03-03T09:36:35.007Z",
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      content: {
        "application/json": {
          examples: {
            noData: {
              summary: "데이터 없음",
              description: "상품 데이터 row가 한개도 없을 시",
              value: {
                success: false,
                error: "NotFoundException",
                statusCode: 404,
                timeStamp: "2025-03-17T03:48:37.098Z",
                reason: "사용자가 없습니다.",
              },
            },
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
    IsNotAdminSwagger(),
  );
};
