import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";
import { ProductIdValidatePipe } from "../../../product/pipe/exist/product-id-validate.pipe";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { CartService } from "../../services/cart.service";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { CartSearcher } from "../../logic/cart.searcher";
import { CartIdValidatePipe } from "../../pipe/cart-id-validate.pipe";
import { CartsResponseDto } from "../../dto/response/carts-response.dto";
import { CartBody } from "../../dto/request/cart-body.dto";
import { CreateCartDto } from "../../dto/request/create-cart.dto";
import { ModifyCartDto } from "../../dto/request/modify-cart.dto";
import { FindAllCartsDto } from "../../dto/request/find-all-carts.dto";

@ApiTags("v1 고객 Cart API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/cart", version: "1" })
export class CartV1ClientController {
  constructor(private readonly searcher: CartSearcher, private readonly service: CartService) {}

  // @ApiOperation({
  //   summary: "find carts with id",
  //   description: "사용자의 장바구니를 모두 가져옵니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/all")
  public async findAllCarts(
    @Query() query: FindAllCartsDto,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<CartsResponseDto>> {
    query.userId = userId;
    const cartRaws = await this.searcher.findAllRaws(query);
    const totalPrice = cartRaws.map((raw) => raw.cart.totalPrice).reduce((acc, cur) => acc + cur, 0);

    return {
      statusCode: 200,
      message: `사용자아이디(${userId})에 해당하는 장바구니 정보를 가져옵니다.`,
      result: {
        cartRaws,
        totalPrice,
      },
    };
  }

  // @ApiOperation({
  //   summary: "create cart",
  //   description: "장바구니를 생성합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/product/:productId")
  public async createCart(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @GetJWT() { userId }: JwtAccessTokenPayload,
    @Body() body: CartBody,
  ): Promise<JsonGeneralInterface<null>> {
    const dto: CreateCartDto = { productId, clientUserId: userId, body };
    await this.service.createCart(dto);

    return {
      statusCode: 201,
      message: "장바구니를 생성하였습니다.",
    };
  }

  // @ApiOperation({
  //   summary: "modify cart with id",
  //   description: "아이디에 해당하는 장바구니를 수정합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Put("/:cartId/product/:productId")
  public async modifyCart(
    @Param("cartId", CartIdValidatePipe) cartId: string,
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Body() body: CartBody,
  ): Promise<JsonGeneralInterface<null>> {
    const dto: ModifyCartDto = { cartId, productId, body };
    await this.service.modifyCart(dto);

    return {
      statusCode: 200,
      message: `id(${cartId})에 해당하는 장바구니를 수정합니다.`,
    };
  }

  // @ApiOperation({
  //   summary: "delete all cart with user id",
  //   description: "사용자의 장바구니를 모두 비웁니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/")
  public async deleteAllCart(@GetJWT() jwtPayload: JwtAccessTokenPayload): Promise<JsonGeneralInterface<null>> {
    await this.service.deleteAllCarts(jwtPayload.userId);

    return {
      statusCode: 200,
      message: "장바구니를 모두 비웁니다.",
    };
  }

  // @ApiOperation({
  //   summary: "delete cart with id",
  //   description: "아이디에 해당하는 장바구니를 제거합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:cartId")
  public async deleteCart(@Param("cartId", CartIdValidatePipe) id: string): Promise<JsonGeneralInterface<null>> {
    await this.service.deleteCart(id);

    return {
      statusCode: 200,
      message: `id(${id})에 해당하는 장바구니를 제거합니다.`,
    };
  }
}
