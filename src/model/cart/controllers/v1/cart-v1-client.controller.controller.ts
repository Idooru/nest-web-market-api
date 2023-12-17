import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiTags("v1 고객 Cart API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/cart", version: "1" })
export class CartV1ClientControllerController {
  constructor(
    private readonly cartSearcher: CartSearcher,
    private readonly cartUpdateService: CartUpdateService,
  ) {}

  @ApiOperation({
    summary: "find carts with id",
    description: "장바구니를 가져옵니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public async findCartsWithId(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<CartEntity[]>> {
    const result = await this.cartSearcher.findCartsWithId(jwtPayload.userId);

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
    @Param("productId", ProductIdValidatePipe) productId: string,
    @GetJWT() jwtPaylaod: JwtAccessTokenPayload,
    @Body() cartBodyDto: CartBodyDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.cartUpdateService.createCart(
      productId,
      jwtPaylaod.userId,
      cartBodyDto.quantity,
    );

    return {
      statusCode: 201,
      message: "장바구니를 생성하였습니다.",
    };
  }
}
