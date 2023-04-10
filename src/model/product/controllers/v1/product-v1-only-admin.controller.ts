import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  Put,
  Inject,
} from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookieParser } from "src/common/decorators/media-cookie-parser.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonClearCookieInterface } from "src/common/interceptors/general/interface/json-clear-cookie.interface";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { CreateProductDto } from "../../dto/create-product.dto";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { RequestProductForAdminDto } from "../../dto/request-product-for-admin.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductGeneralService } from "../../services/product-general.service";
import { MediaDto } from "src/model/media/dto/media.dto";
import {
  ProductMediaCookieKey,
  productMediaCookieKey,
} from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/product")
export class ProductVersionOneOnlyAdminController {
  constructor(
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    private readonly productGeneralService: ProductGeneralService,
  ) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/all-id")
  async findProductsAllId(): Promise<
    JsonGeneralInterface<RequestProductForAdminDto[]>
  > {
    const products = await this.productGeneralService.findProductsAllId();

    return {
      statusCode: 200,
      message: "데이터베이스에 존재하는 모든 상품 아이디를 가져옵니다.",
      result: products.map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
      })),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:id")
  async findProductById(
    @Param("id") id: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productGeneralService.findProductById(id),
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(
    new VerifyDataGuard(productVerifyCookieKey.is_not_exist.name_executed),
  )
  @Post("/")
  async createProduct(
    @Body()
    createProductDto: CreateProductDto,
    @MediaCookieParser("product_image_url_cookie")
    productImgCookie: MediaDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.createProduct(
      createProductDto,
      productImgCookie,
      jwtPayload,
    );

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
      cookieKey: "product_image_url_cookie",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_not_exist.name_executed,
    ),
  )
  @Put("/:id")
  async modifyProduct(
    @Param("id") id: string,
    @Body() modifyProductDto: ModifyProductDto,
    @MediaCookieParser(productMediaCookieKey.image_url_cookie)
    productImgCookie: MediaDto,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.modifyProduct(
      id,
      modifyProductDto,
      productImgCookie,
    );

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품을 수정하였습니다.`,
      cookieKey: this.productMedia.image_url_cookie,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Patch("/:id/image")
  async modifyProductImage(
    @Param("id") id: string,
    @MediaCookieParser(productMediaCookieKey.image_url_cookie)
    productImgCookie: MediaDto,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.modifyProductImage(id, productImgCookie);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 사진을 수정하였습니다.`,
      cookieKey: this.productMedia.image_url_cookie,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_not_exist.name_executed,
    ),
  )
  @Patch("/:id/name")
  async modifyProductName(
    @Param("id") id: string,
    @Body("name") name: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.modifyProductName(id, name);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 이름을 수정하였습니다.`,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Patch("/:id/price")
  async modifyProductPrice(
    @Param("id") id: string,
    @Body("price") price: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.modifyProductPrice(id, price);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 가격을 수정하였습니다.`,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Patch("/:id/origin")
  async modifyProductOrigin(
    @Param("id") id: string,
    @Body("origin") origin: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.modifyProductOrigin(id, origin);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 원산지를 수정하였습니다.`,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Patch("/:id/description")
  async modifyProductDescription(
    @Param("id") id: string,
    @Body("description") description: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.modifyProductDescription(id, description);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 설명을 수정하였습니다.`,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Patch("/:id/quantity")
  async modifyProductQuantity(
    @Param("id") id: string,
    @Body("quantity") quantity: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.modifyProductQuantity(id, quantity);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 수량을 수정하였습니다.`,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Delete("/:id")
  async removeProduct(
    @Param("id") id: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productGeneralService.removeProduct(id);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
