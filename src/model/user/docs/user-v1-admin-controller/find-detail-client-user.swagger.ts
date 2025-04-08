import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { IsNotAdminSwagger } from "../../../auth/docs/is-not-admin.swagger";
import { UuidParamSwagger } from "../../../../common/docs/uuid-param.swagger";

export const FindDetailClientUserSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "find detail client user",
      description: "고객 사용자의 아이디에 해당하는 사용자의 상세 정보를 가져옵니다.",
    }),
    JwtAuthHeaderSwagger(),
    UuidParamSwagger({ name: "userId", descriptionName: "사용자 아이디" }),
    ApiResponse({
      status: 200,
      description: "고객 사용자 상세 정보 가져오기 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "dae9d3c5-10a1-4abd-a2ce-79b17ce5b624에 해당하는 고객 사용자의 상세 정보를 가져옵니다.",
            result: {
              user: {
                id: "dae9d3c5-10a1-4abd-a2ce-79b17ce5b624",
                role: "client",
                realName: "최승훈",
                phoneNumber: "010-2625-5150",
                email: "shere1765@naver.com",
              },
              payments: [
                {
                  id: "936dbcc4-e7a4-4e83-9c47-7765b5123ac1",
                  quantity: 2,
                  totalPrice: 2000,
                  product: {
                    id: "1102dea8-d4f5-4484-a59e-4befb72e6c7f",
                    name: "test",
                    price: 1000,
                    origin: "한국",
                    category: "test",
                    imageUrls: ["http://localhost:5147/media/product/images/default_product_image.jpg"],
                  },
                },
              ],
              reviews: [
                {
                  id: "3a26b095-2f4f-4d98-9dec-36fc81f88270",
                  title: "전자레인지 리뷰 테스트 제목",
                  content: "전자레인지 리뷰 테스트 본문",
                  starRateScore: 1,
                  countForModify: 2,
                  imageUrls: [],
                  videoUrls: [],
                },
                {
                  id: "b75602cf-4b08-43da-b242-6198bc248a79",
                  title: "고양이 리뷰 수정 테스트 제목",
                  content: "고양이 리뷰 수정 테스트 본문",
                  starRateScore: 2,
                  countForModify: 1,
                  imageUrls: [
                    "http://localhost:5147/media/review/images/cat4-1743248825672.jpeg",
                    "http://localhost:5147/media/review/images/cat3-1743248825671.jpeg",
                  ],
                  videoUrls: [
                    "http://localhost:5147/media/review/videos/mong2-1743248837576.mp4",
                    "http://localhost:5147/media/review/videos/mong1-1743248837593.mp4",
                  ],
                },
                {
                  id: "cb9923b5-0d86-499a-80a7-fc439a161f1b",
                  title: "한우불고기 리뷰 테스트 제목",
                  content: "한우불고기 리뷰 테스트 본문",
                  starRateScore: 1,
                  countForModify: 2,
                  imageUrls: [],
                  videoUrls: [],
                },
              ],
              inquiryRequests: [
                {
                  id: "f1e98a62-f2d1-41d5-b365-0efcfe284698",
                  title: "로봇 청소기 문의 요청 드립니다.",
                  content: "질 안좋음",
                  inquiryOption: "product-status",
                  isAnswered: true,
                  imageUrls: [],
                  videoUrls: [],
                },
                {
                  id: "b71f2494-8c32-405f-b8ce-13fd711bca62",
                  title: "스마트 오븐 문의 요청 드립니다.",
                  content: "배송 늦음",
                  inquiryOption: "delivery-status",
                  isAnswered: false,
                  imageUrls: [],
                  videoUrls: [],
                },
              ],
            },
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
