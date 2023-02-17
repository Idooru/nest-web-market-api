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
} from "@nestjs/common";
import {
  mediaCookieKeys,
  verifyCookieKeys,
} from "src/common/config/cookie-key-configs";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verfiy/verify-data.guard";
import { JsonClearCookieInterface } from "src/common/interceptors/general/interface/json-clear-cookie.interface";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";
import { CreateProductDto } from "../../dto/create_product.dto";
import { ModifyProductDto } from "../../dto/modify_product.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductGeneralService } from "../../services/product-general.service";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/product")
export class ProductVersionOneOnlyAdminController {
  constructor(private readonly productGeneralService: ProductGeneralService) {}

  private readonly productImageCookieKey =
    mediaCookieKeys.product.image_url_cookie;

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:id")
  async getProductById(
    @Param("id") id: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productGeneralService.getProductById(id),
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.product.is_not_exist.name_executed),
  )
  @Post("/")
  async createProduct(
    @Body()
    createProductDto: CreateProductDto,
    @Cookie("product_image_url_cookie")
    productImgCookie: MediaUrlCookieValue,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.createProduct(
      createProductDto,
      productImgCookie,
    );

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
      cookieKey: "product_image_url_cookie",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.product.is_not_exist.name_executed),
  )
  @Put("/:id")
  async modifyProduct(
    @Param("id") id: string,
    @Body() modifyProductDto: ModifyProductDto,
    @Cookie(mediaCookieKeys.product.image_url_cookie)
    productImgCookie: MediaUrlCookieValue,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.modifyProduct(
      id,
      modifyProductDto,
      productImgCookie,
    );

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품을 수정하였습니다.`,
      cookieKey: this.productImageCookieKey,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Patch("/:id/image")
  async modifyProductImage(
    @Param("id") id: string,
    @Cookie(mediaCookieKeys.product.image_url_cookie)
    productImgCookie: MediaUrlCookieValue,
  ): Promise<JsonClearCookieInterface> {
    await this.productGeneralService.modifyProductImage(id, productImgCookie);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 사진을 수정하였습니다.`,
      cookieKey: this.productImageCookieKey,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.product.is_not_exist.name_executed),
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
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
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