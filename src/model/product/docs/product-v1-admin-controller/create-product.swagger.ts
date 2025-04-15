import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ProductBody } from "../../dto/request/product-body.dto";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { IsNotAdminSwagger } from "../../../auth/docs/is-not-admin.swagger";

export const CreateProductSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "create product",
      description: "상품을 생성합니다. 이 api를 실행하기 전에 무조건 상품 이미지를 하나 업로드해야 합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiBody({ type: ProductBody, required: true }),
    ApiResponse({
      status: 201,
      description: "상품 생성 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "상품을 생성하였습니다.",
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
                timeStamp: "Wed Mar 19 2025 10:30:40 GMT+0900 (Korean Standard Time)",
                reason: {
                  name: ["name should not be empty", "name must be a string"],
                  price: ["price should not be empty", "price must be a positive number"],
                  origin: ["origin should not be empty", "origin must be a string"],
                  category: [
                    "category should not be empty",
                    "category must be a string",
                    "입력한 내용은 애완동물,가전제품,음식,test중 하나와 일치하지 않습니다.",
                  ],
                  description: ["description should not be empty", "description must be a string"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            duplication: {
              summary: "입력값 중복",
              description: "상품 이름이 DB에 있는 것과 중복 될 때",
              value: {
                success: false,
                error: "BadRequestException",
                statusCode: 400,
                timeStamp: "2025-03-19T01:31:36.132Z",
                reason: "이미 존재하는 product name(강아지2)입니다.",
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
