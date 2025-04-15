import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const FindAllProductsFromLatestSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find all products from latest",
      description: "전체 상품 정보를 최신 순서로 가져옵니다.",
    }),
    ApiResponse({
      status: 200,
      description: "전체 상품 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "전체 상품 정보를 최신 순서로 가져옵니다.",
            result: [
              {
                productId: "872cf09e-2388-4470-b1f1-2b07a0ea42a6",
                productName: "노트북",
                productPrice: 5000,
                productCategory: "가전제품",
                imageUrl: "http://localhost:5147/media/product/images/notebook-1741007037855.jpeg",
                averageScore: 5,
                reviewCount: 0,
              },
              {
                productId: "ce468b1c-0b90-42aa-961c-f81feecdbd0a",
                productName: "강아지",
                productPrice: 1000,
                productCategory: "애완동물",
                imageUrl: "http://localhost:5147/media/product/images/dog3-1741700424890.jpg",
                averageScore: 5,
                reviewCount: 0,
              },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: "전체 상품이 존재하지 않을 경우",
      content: {
        "application/json": {
          example: {
            success: false,
            error: "NotFoundException",
            statusCode: 404,
            timeStamp: "2025-03-17T04:26:39.464Z",
            reason: "전체 상품을 찾을수가 없습니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
  );
};
