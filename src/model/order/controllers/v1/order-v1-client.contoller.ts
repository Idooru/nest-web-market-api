import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { OrderBodyDto } from "../../dto/order-body.dto";
import { OrderTransactionExecutor } from "../../logic/transaction/order-transaction.executor";

@ApiTags("v1 고객 Order API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/order", version: "1" })
export class OrderV1ClientContoller {
  constructor(private readonly orderTransaction: OrderTransactionExecutor) {}

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/")
  public async createOrder(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() orderBodyDto: OrderBodyDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.orderTransaction.createOrder({
      clientId: jwtPayload.userId,
      orderBodyDto,
    });

    return {
      statusCode: 201,
      message: "결제 주문이 완료되었습니다.",
    };
  }
}
