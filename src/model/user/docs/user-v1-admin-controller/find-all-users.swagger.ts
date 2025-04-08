import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { IsNotAdminSwagger } from "../../../auth/docs/is-not-admin.swagger";
import { AlignSwagger } from "../../../../common/docs/align.swagger";

export const FindAllUsersSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find all users from latest",
      description: "전체 사용자 정보를 가져옵니다.",
    }),
    AlignSwagger(),
    ApiQuery({
      name: "column",
      required: false,
      enum: ["createdAt", "role", "nickName", "email"],
      description: "정보를 정렬하기 위한 기준입니다.",
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
            message: "query 조건에 해당하는 전체 사용자 정보를 가져옵니다.",
            result: [
              {
                id: "6c14f98e-3fa0-4178-ae68-12d9db142ae6",
                role: "admin",
                email: "shere1765@gmail.com",
                nickName: "shlee",
                createdAt: "2025-03-03T09:36:35.007Z",
              },
              {
                id: "286967b7-9fb5-4fe6-822c-d595777f8cc4",
                role: "admin",
                email: "shere1766@gmail.com",
                nickName: "shkim",
                createdAt: "2025-03-03T10:08:22.734Z",
              },
              {
                id: "9eb4d805-dc62-4477-955b-af9f11d11d16",
                role: "client",
                email: "shere1767@gmail.com",
                nickName: "shpark",
                createdAt: "2025-03-03T11:17:35.210Z",
              },
              {
                id: "dae9d3c5-10a1-4abd-a2ce-79b17ce5b624",
                role: "client",
                email: "shere1765@naver.com",
                nickName: "shchoi",
                createdAt: "2025-03-11T07:17:56.625Z",
              },
              {
                id: "d4c70c16-88a8-4831-b218-ca7478c45cd4",
                role: "client",
                email: "hgdong0101@gmail.com",
                nickName: "gdhong",
                createdAt: "2025-03-24T01:18:15.975Z",
              },
            ],
          },
        },
      },
    }),
    ServerErrorSwagger(),
    JwtAuthFailSwagger(),
    IsNotAdminSwagger(),
  );
};
