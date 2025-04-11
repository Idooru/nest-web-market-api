import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ServerErrorSwagger } from "../../../../common/docs/internal-server-error.swagger";
import { BasicAuthDto } from "../../dto/request/basic-auth.dto";

export const ResetPasswordSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: "reset password",
      description:
        "비밀번호를 재설정합니다. 본인의 이메일과 변경할 비밀번호를 사용합니다. 해당 API는 비밀번호를 잃어버려 재설정하는 용도로 사용할 수 있도록 합니다",
    }),
    ApiBody({ type: BasicAuthDto, required: true }),
    ApiResponse({
      status: 200,
      description: "사용자 비밀번호 재설정 성공",
      content: {
        "application/json": {
          example: {
            success: true,
            statusCode: 200,
            message: "사용자 비밀번호를 재설정 하였습니다.",
          },
        },
      },
    }),
    ServerErrorSwagger(),
  );
};
