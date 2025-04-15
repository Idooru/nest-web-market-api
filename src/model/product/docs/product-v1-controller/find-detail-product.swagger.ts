import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UuidParamSwagger } from "../../../../common/docs/uuid-param.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";

export const FindDetailProductSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find detail product",
      description: "상품의 상세 정보를 가져옵니다.",
    }),
    UuidParamSwagger({ name: "productId", descriptionName: "상품 아이디" }),
    ApiResponse({
      status: 200,
      description: "아이디로 상품 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "9f7e5e4d-e4ea-449b-af46-d12d4d4dbbad에 해당하는 상품 정보를 가져옵니다.",
            result: {
              product: {
                id: "9f7e5e4d-e4ea-449b-af46-d12d4d4dbbad",
                name: "고양이",
                price: 15000,
                origin: "한국",
                category: "애완동물",
                description: "고양이",
                stock: 96,
                imageUrls: [
                  "http://localhost:5147/media/product/images/cat1-1743221644434.jpg",
                  "http://localhost:5147/media/product/images/cat2-1743221644436.jpg",
                ],
                averageScore: 2,
              },
              reviews: [
                {
                  id: "b75602cf-4b08-43da-b242-6198bc248a79",
                  title: "고양이 리뷰 수정 테스트 제목",
                  content: "고양이 리뷰 수정 테스트 본문",
                  starRateScore: 2,
                  imageUrls: [
                    "http://localhost:5147/media/review/images/cat4-1743248825672.jpeg",
                    "http://localhost:5147/media/review/images/cat3-1743248825671.jpeg",
                  ],
                  videoUrls: [
                    "http://localhost:5147/media/review/videos/mong2-1743248837576.mp4",
                    "http://localhost:5147/media/review/videos/mong1-1743248837593.mp4",
                  ],
                  nickName: "shchoi",
                },
              ],
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: "파라미터로 넘긴 상품 아이디가 DB에 없을 경우",
      content: {
        "application/json": {
          example: {
            success: false,
            error: "NotFoundException",
            statusCode: 404,
            timeStamp: "2025-03-19T01:12:29.567Z",
            reason: "존재하지 않은 product id(ce468b1c-0b90-42aa-961c-f81feecdbd0)입니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
  );
};
