import { JwtPayload } from "../../../common/interfaces/jwt.payload.interface";
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ResponseProductDto,
  ResponseProductsDto,
} from "../dto/response_product.dto";
import { JSON } from "../../../common/interfaces/json.success.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ProductService } from "../providers/product.service";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JsonNoCookieInterceptor } from "src/common/interceptors/json.no.cookie.interceptor";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(JsonNoCookieInterceptor)
  @Get("/")
  async getProductsAllFromLatest(): Promise<JSON<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromLatest(),
    };
  }

  @UseInterceptors(JsonNoCookieInterceptor)
  @Get("/oldest")
  async getProductsAllFromOldest(): Promise<JSON<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromOldest(),
    };
  }

  @UseInterceptors(JsonNoCookieInterceptor)
  @Get("/search_name")
  async getProductByName(
    @Query("n") name: string,
  ): Promise<JSON<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${name}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(name),
    };
  }

  @UseInterceptors(JsonNoCookieInterceptor)
  @Get("/search_id")
  async getProductById(
    @Query("i") productId: string,
  ): Promise<JSON<ResponseProductDto>> {
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
    @GetJWT() jwtPayload: JwtPayload,
    @Cookies("Product_Image_Url_COOKIE") productImg: string | null,
  ): Promise<JSON<void>> {
    await this.productService.createProduct(
      createProductDto,
      jwtPayload.nickname,
      productImg,
    );

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
      cookieKey: "Product_Image_Url_COOKIE",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Patch("/")
  async modifyProduct(
    @Query("id") productId: string,
    @Body() modifyProductDto: ModifyProductDto,
    @GetJWT() JwtPayload: JwtPayload,
    @Cookies("Product_Image_Url_COOKIE") productImg: string | null,
  ): Promise<JSON<string>> {
    await this.productService.modifyProduct(
      productId,
      modifyProductDto,
      JwtPayload.nickname,
      productImg,
    );

    return {
      statusCode: 201,
      message: `${productId}에 해당하는 상품을 수정하였습니다.`,
      cookieKey: "Product_Image_Url_COOKIE",
      result: productId,
    };
  }

  @UseInterceptors(JsonNoCookieInterceptor)
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Delete("/")
  async removeProduct(@Query("id") productId: string): Promise<JSON<void>> {
    await this.productService.removeProduct(productId);

    return {
      statusCode: 201,
      message: `${productId}에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
