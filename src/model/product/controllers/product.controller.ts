import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { ImagesEntity } from "./../../upload/entities/upload.entity";
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
import { JSON } from "../../../common/interfaces/json-success.interface";
import { CreateProductBody } from "../dto/create_product.dto";
import { ModifyProductBody } from "../dto/modify_product.dto";
import { ProductService } from "./../services/product.service";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { ProductImageCookieKey } from "./../../../common/config/etc";
import { Response } from "express";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/")
  async getProductsAllFromLatest(): Promise<JSON<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromLatest(),
    };
  }

  @Get("/oldest")
  async getProductsAllFromOldest(): Promise<JSON<ResponseProductsDto[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromOldest(),
    };
  }

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

  @Get("/search_id")
  async getProductById(
    @Query("i") id: string,
  ): Promise<JSON<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(id),
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @Body()
    createProductBody: CreateProductBody,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Cookies(ProductImageCookieKey) productImg: ImagesEntity,
    @Res() res: Response,
  ): Promise<JSON<void>> {
    const createProductDto = {
      ...createProductBody,
      image: productImg,
    };

    await this.productService.createProduct(
      createProductDto,
      jwtPayload.nickname,
    );

    try {
      res.clearCookie(ProductImageCookieKey);
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
    id: string,
    @Body() modifyProductBody: ModifyProductBody,
    @GetDecodedJwt() JwtPayload: JwtPayload,
    @Cookies(ProductImageCookieKey) productImg: ImagesEntity,
    @Res() res: Response,
  ): Promise<JSON<string>> {
    const modifyProductDto = {
      ...modifyProductBody,
      image: productImg,
    };
    await this.productService.modifyProduct(
      id,
      modifyProductDto,
      JwtPayload.nickname,
    );

    try {
      res.clearCookie(ProductImageCookieKey);
    } catch (err) {
      throw new NotFoundException("쿠키가 변조 되었습니다.");
    }

    return {
      statusCode: 201,
      message: "상품을 수정하였습니다.",
      result: id,
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Delete("/")
  async removeProduct(@Query("id") id: string): Promise<JSON<void>> {
    await this.productService.removeProduct(id);

    return {
      statusCode: 201,
      message: `${id}에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
