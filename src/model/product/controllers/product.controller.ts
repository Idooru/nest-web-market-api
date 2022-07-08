import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  UseGuards,
  Res,
  NotFoundException,
} from "@nestjs/common";
import {
  ResponseProductDto,
  ResponseProductsDto,
} from "../dto/response_product.dto";
import { JsonResult } from "../../../common/interfaces/json-success.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ProductService } from "../providers/product.service";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { Response } from "express";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/")
  async getProductsAllFromLatest(): Promise<JsonResult<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromLatest(),
    };
  }

  @Get("/oldest")
  async getProductsAllFromOldest(): Promise<JsonResult<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromOldest(),
    };
  }

  @Get("/search_name")
  async getProductByName(
    @Query("n") name: string,
  ): Promise<JsonResult<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${name}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(name),
    };
  }

  @Get("/search_id")
  async getProductById(
    @Query("i") productId: string,
  ): Promise<JsonResult<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(productId),
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @Body()
    createProductDto: CreateProductDto,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Cookies("productImageUrl") productImg: string | null,
    @Res() res: Response,
  ): Promise<JsonResult<void>> {
    await this.productService.createProduct(
      createProductDto,
      jwtPayload.nickname,
      productImg,
    );

    try {
      res.clearCookie("productImageUrl");
    } catch (err) {
      throw new NotFoundException("쿠키가 변조 되었습니다.");
    }

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Patch("/")
  async modifyProduct(
    @Query("id")
    productId: string,
    @Body() modifyProductDto: ModifyProductDto,
    @GetDecodedJwt() JwtPayload: JwtPayload,
    @Cookies("productImageUrl") productImg: string | null,
    @Res() res: Response,
  ): Promise<JsonResult<string>> {
    await this.productService.modifyProduct(
      productId,
      modifyProductDto,
      JwtPayload.nickname,
      productImg,
    );

    try {
      res.clearCookie("productImageUrl");
    } catch (err) {
      throw new NotFoundException("쿠키가 변조 되었습니다.");
    }

    return {
      statusCode: 201,
      message: "상품을 수정하였습니다.",
      result: productId,
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Delete("/")
  async removeProduct(
    @Query("id") productId: string,
  ): Promise<JsonResult<void>> {
    await this.productService.removeProduct(productId);

    return {
      statusCode: 201,
      message: `${productId}에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
