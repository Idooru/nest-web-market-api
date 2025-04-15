import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { AlignSwagger } from "../../../../common/docs/align.swagger";

export const FindAllProductsSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find all products",
      description: "전체 상품 정보를 가져옵니다.",
    }),
    AlignSwagger(),
    ApiQuery({}),
    ApiResponse({
      status: 200,
      description: "전체 상품 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "query 조건에 해당하는 전체 상품 정보를 가져옵니다.",
            result: [
              {
                id: "9f7e5e4d-e4ea-449b-af46-d12d4d4dbbad",
                name: "고양이",
                price: 15000,
                category: "애완동물",
                createdAt: "2025-03-29T04:14:08.907Z",
                imageUrls: [
                  "http://localhost:5147/media/product/images/cat1-1743221644434.jpg",
                  "http://localhost:5147/media/product/images/cat2-1743221644436.jpg",
                ],
                averageScore: 2,
                reviewCount: 1,
              },
              {
                id: "d38e47ca-36fd-43ed-886d-d5c818def469",
                name: "로봇청소기",
                price: 280000,
                category: "가전제품",
                createdAt: "2025-03-28T04:47:18.047Z",
                imageUrls: ["http://localhost:5147/media/product/images/default_product_image.jpg"],
                averageScore: 0,
                reviewCount: 0,
              },
              {
                id: "9458cb10-c583-4727-abdc-26cf014905c8",
                name: "스마트오븐",
                price: 300000,
                category: "가전제품",
                createdAt: "2025-03-28T04:47:18.028Z",
                imageUrls: ["http://localhost:5147/media/product/images/default_product_image.jpg"],
                averageScore: 0,
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
