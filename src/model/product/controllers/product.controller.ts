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
import { IsAdminGuard } from "./../../../common/guards/isAdmin.guard";
import { IsLoginGuard } from "./../../../common/guards/isLogin.guard";
import { ProductImageCookieKey } from "./../../../common/config/etc";
import { Response } from "express";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { IsAdmin } from "src/common/decorators/isAdmin.decorator";

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

  @Get("/search_n")
  async getProductByName(
    @Query("name") name: string,
  ): Promise<JSON<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${name}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(name),
    };
  }

  @Get("/search_i")
  async getProductById(
    @Query("id") id: string,
  ): Promise<JSON<ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(id),
    };
  }

  // @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @IsAdmin()
    @Body()
    createProductBody: CreateProductBody,
    @Cookies(ProductImageCookieKey) productImg: ImagesEntity,
    @Res() res: Response,
  ): Promise<JSON<void>> {
    const createProductDto = {
      ...createProductBody,
      image: productImg,
    };

    await this.productService.createProduct(createProductDto);

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

  @UseGuards(IsLoginGuard)
  @Patch("/qi")
  async modifyProduct(
    @IsAdmin()
    @Query("id")
    id: string,
    @Body() modifyProductBody: ModifyProductBody,
    @Cookies(ProductImageCookieKey) productImg: ImagesEntity,
    @Res() res: Response,
  ): Promise<JSON<string>> {
    const modifyProductDto = {
      ...modifyProductBody,
      image: productImg,
    };
    await this.productService.modifyProduct(id, modifyProductDto);

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
  @Delete("/qi")
  async removeProduct(@Query("id") id: string): Promise<JSON<void>> {
    await this.productService.removeProduct(id);

    return {
      statusCode: 201,
      message: `${id}에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
