import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { IsAdminGuard } from "src/common/guards/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/is-login.guard";
import { JsonClearCookieInterface } from "src/common/interceptors/interface/json-clear-cookie.interface";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json-clear-cookie.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/json-general.interceptor";
import { MediaUrlCookie } from "src/model/upload/media.url.cookie.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductService } from "../providers/product.service";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/product")
export class ProductVersionOneOnlyAdminController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/id/:id")
  async getProductById(
    @Param("id") productId: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(productId),
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Post("/")
  async createProduct(
    @Body()
    createProductDto: CreateProductDto,
    @Cookie("product_image_url_cookie")
    productImgCookie: MediaUrlCookie,
  ): Promise<JsonClearCookieInterface> {
    if (!productImgCookie) {
      throw new BadRequestException(
        "상품을 생성할 때 사용할 이미지를 준비해주세요.",
      );
    }

    await this.productService.createProduct(createProductDto, productImgCookie);

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
      cookieKey: "Product_Image_Url_COOKIE",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Patch("/:id")
  async modifyProduct(
    @Param("id") productId: string,
    @Body() modifyProductDto: ModifyProductDto,
    @Cookie("product_image_url_cookie")
    productImgCookie: MediaUrlCookie,
  ): Promise<JsonClearCookieInterface> {
    if (!productImgCookie) {
      throw new BadRequestException(
        "상품을 수정할 때 사용할 이미지를 준비해주세요.",
      );
    }

    await this.productService.modifyProduct(
      productId,
      modifyProductDto,
      productImgCookie,
    );

    return {
      statusCode: 201,
      message: `id${productId}에 해당하는 상품을 수정하였습니다.`,
      cookieKey: "Product_Image_Url_COOKIE",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:id")
  async removeProduct(
    @Param("id") productId: string,
  ): Promise<JsonGeneralInterface<void>> {
    await this.productService.removeProduct(productId);

    return {
      statusCode: 201,
      message: `${productId}에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
