import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  Param,
  BadRequestException,
} from "@nestjs/common";
import * as response_productDto from "../dto/response_product.dto";
import * as modify_productDto from "../dto/modify_product.dto";
import { ProductService } from "../providers/product.service";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { JsonGeneralInterceptor } from "src/common/interceptors/json.general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json.general.interface";
import { JsonClearCookieInterface } from "src/common/interceptors/interface/json.clear.cookie.interface";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async getProductsAllFromLatest(): Promise<
    JsonGeneralInterface<response_productDto.ResponseProductsDto[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromLatest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async getProductsAllFromOldest(): Promise<
    JsonGeneralInterface<response_productDto.ResponseProductsDto[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromOldest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/name/:name")
  async getProductByName(
    @Param("name") productName: string,
  ): Promise<JsonGeneralInterface<response_productDto.ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${productName}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(productName),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/id/:id")
  async getProductById(
    @Param("id") productId: string,
  ): Promise<JsonGeneralInterface<response_productDto.ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(productId),
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @Body()
    createProductDto: CreateProductDto,
    @Cookie("Product_Image_Url_COOKIE")
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
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Patch("/:id")
  async modifyProduct(
    @Param("id") productId: string,
    @Body() modifyProductDto: modify_productDto.ModifyProductDto,
    @Cookie("Product_Image_Url_COOKIE")
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
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
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
