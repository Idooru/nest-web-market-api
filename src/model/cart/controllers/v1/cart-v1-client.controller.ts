import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";
import { CartBodyDto } from "../../dto/cart-body.dto";
import { ProductIdValidatePipe } from "../../../product/pipe/exist/product-id-validate.pipe";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { CartUpdateService } from "../../services/cart-update.service";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { CartSearcher } from "../../logic/cart.searcher";
import { CartEntity } from "../../entities/cart.entity";
import { CartIdValidatePipe } from "../../pipe/cart-id-validate.pipe";

@ApiTags("v1 고객 Cart API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/cart", version: "1" })
export class CartV1ClientController {
  constructor(
    private readonly cartSearcher: CartSearcher,
    private readonly cartUpdateService: CartUpdateService,
  ) {}

  @ApiOperation({
    summary: "find carts with id",
    description: "사용자의 장바구니를 모두 가져옵니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public async findCartsWithUserId(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<CartEntity[]>> {
    const result = await this.cartSearcher.findCartsWithUserId(
      jwtPayload.userId,
    );

    return {
      statusCode: 200,
      message: `사용자아이디(${jwtPayload.userId})에 해당하는 장바구니 정보를 가져옵니다.`,
      result,
    };
  }

  @ApiOperation({
    summary: "create cart",
    description: "장바구니를 생성합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/product/:productId")
  public async createCart(
    @Param("productId", ProductIdValidatePipe) id: string,
    @GetJWT() jwtPaylaod: JwtAccessTokenPayload,
    @Body() cartBodyDto: CartBodyDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.cartUpdateService.createCart(id, jwtPaylaod.userId, cartBodyDto);

    return {
      statusCode: 201,
      message: "장바구니를 생성하였습니다.",
    };
  }

  @ApiOperation({
    summary: "modify cart with id",
    description: "아이디에 해당하는 장바구니를 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Put("/:cartId")
  public async modifyCartWithId(
    @Param("cartId", CartIdValidatePipe) id: string,
    @Body() cartBodyDto: CartBodyDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.cartUpdateService.modifyCartWithId({ id, cartBodyDto });

    return {
      statusCode: 200,
      message: `id(${id})에 해당하는 장바구니를 수정합니다.`,
    };
  }

  @ApiOperation({
    summary: "delete all cart with user id",
    description: "사용자의 장바구니를 모두 비웁니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/")
  public async deleteAllCartWithUserId(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<null>> {
    await this.cartUpdateService.deleteAllCartWithUserId(jwtPayload.userId);

    return {
      statusCode: 200,
      message: "장바구니를 모두 비웁니다.",
    };
  }

  @ApiOperation({
    summary: "delete cart with id",
    description: "아이디에 해당하는 장바구니를 제거합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:cartId")
  public async deleteCartWithId(
    @Param("cartId", CartIdValidatePipe) id: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.cartUpdateService.deleteCartWithId(id);

    return {
      statusCode: 200,
      message: `id(${id})에 해당하는 장바구니를 제거합니다.`,
    };
  }
}
