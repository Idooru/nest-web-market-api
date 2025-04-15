import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const FindProductWithNameSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find product with name",
      description: "상품의 이름에 해당하는 전체 상품 정보를 가져옵니다.",
    }),
    ApiParam({ name: "product", description: "검색할 상품 이름입니다.", required: true, example: "강아지" }),
    ApiResponse({
      status: 200,
      description: "이름에 해당하는 상품 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "이름이 강에 해당하는 상품 정보를 가져옵니다.",
            result: [
              {
                productId: "cb3500e8-fad9-4fc4-a26f-92e580ad2717",
                productName: "강아지2",
                productPrice: 10000,
                productCategory: "애완동물",
                imageUrl: "http://localhost:5147/media/product/images/dog3-1742345006053.jpg",
                averageScore: 0,
                reviewCount: "0",
              },
              {
                productId: "ce468b1c-0b90-42aa-961c-f81feecdbd0a",
                productName: "강아지",
                productPrice: 1000,
                productCategory: "애완동물",
                imageUrl: "http://localhost:5147/media/product/images/dog3-1741700424890.jpg",
                averageScore: 9,
                reviewCount: "0",
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: "검색한 상품 이름이 존재하지 않을 경우",
      content: {
        "application/json": {
          example: {
            success: false,
            error: "NotFoundException",
            statusCode: 404,
            timeStamp: "2025-03-19T00:41:03.232Z",
            reason: "상품이름(test)으로 검색을 시도하였으나 결과가 없습니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
  );
};
