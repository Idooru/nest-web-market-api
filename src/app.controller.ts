import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { JsonGeneralInterceptor } from "./common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "./common/interceptors/interface/json-general-interface";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("공용 App Api")
@Controller("/")
export class AppController {
  @ApiOperation({
    summary: "main page",
    description: "어플리케이션의 메인 페이지 입니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public mainPage(): JsonGeneralInterface<void> {
    return {
      statusCode: 200,
      message: "메인 페이지 입니다.",
    };
  }
}
