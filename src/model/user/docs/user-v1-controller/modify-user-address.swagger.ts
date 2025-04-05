import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthFailSwagger, JwtAuthHeaderSwagger } from "../../../auth/docs/jwt-auth.swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { ModifyUserAddressDto } from "../../dto/request/modify-user-address.dto";

export const ModifyUserAddressSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "modify user address",
      description: "본인의 사용자 집주소 column을 수정합니다.",
    }),
    JwtAuthHeaderSwagger(),
    ApiBody({ type: ModifyUserAddressDto, required: true }),
    ApiResponse({
      status: 201,
      description: "사용자 집주소 수정 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 201,
            message: "사용자의 집주소를 수정합니다.",
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
              description: "집주소를 제외하고 요청을 보낼 시",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Mon Mar 17 2025 11:31:00 GMT+0900 (Korean Standard Time)",
                reason: {
                  address: [
                    "address must be shorter than or equal to 50 characters",
                    "address must be longer than or equal to 10 characters",
                    "address should not be empty",
                    "address must be a string",
                  ],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            shorterThen10: {
              description: "집주소의 입력 길이가 10보다 작을 때",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Mon Mar 17 2025 11:34:12 GMT+0900 (Korean Standard Time)",
                reason: {
                  address: ["address must be longer than or equal to 10 characters"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
              },
            },
            longerThen50: {
              description: "집주소의 입력 길이가 50보다 클 때",
              value: {
                success: false,
                error: "ValidationException",
                statusCode: 400,
                timeStamp: "Mon Mar 17 2025 11:35:52 GMT+0900 (Korean Standard Time)",
                reason: {
                  address: ["address must be shorter than or equal to 50 characters"],
                },
                info: "전송될 데이터의 유효성을 잘 확인해주세요.",
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
