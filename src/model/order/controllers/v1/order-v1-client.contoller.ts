import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { OrderBody } from "../../dto/order-body.dto";
import { OrderTransactionExecutor } from "../../logic/transaction/order-transaction.executor";
import { CreateOrderDto } from "../../dto/create-order.dto";
import { OrderSearcher } from "../../logic/order.searcher";
import { OrderEntity } from "../../entities/order.entity";

@ApiTags("v1 고객 Order API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/order", version: "1" })
export class OrderV1ClientController {
  constructor(private readonly transaction: OrderTransactionExecutor, private readonly searcher: OrderSearcher) {}

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public async findOrders(@GetJWT() { userId }: JwtAccessTokenPayload): Promise<JsonGeneralInterface<OrderEntity[]>> {
    const result = await this.searcher.findOrders(userId);

    return {
      statusCode: 200,
      message: "결제 정보를 전부 가져옵니다.",
      result,
    };
  }

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/")
  public async createOrder(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() body: OrderBody,
  ): Promise<JsonGeneralInterface<void>> {
    const dto: CreateOrderDto = { clientId: jwtPayload.userId, body };
    await this.transaction.createOrder(dto);

    return {
      statusCode: 201,
      message: "결제 주문이 완료되었습니다.",
    };
  }
}
