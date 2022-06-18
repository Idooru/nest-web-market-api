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
} from "@nestjs/common";
import {
  ResponseProductDto,
  ResponseProductsDto,
} from "../dto/response_product.dto";
import { JSON } from "../../../common/interfaces/json.interface";
import { CreateProductDto, CreateProductBody } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ProductService } from "./../services/product.service";
import { IsAdminGuard } from "./../../../common/guards/isAdmin.guard";
import { IsLoginGuard } from "./../../../common/guards/isLogin.guard";
import { GetImageCookie } from "src/common/decorators/get-image-cookie.decorator";
import { ImageGetDto } from "src/model/upload/dto/image-get.dto";
import { Response } from "express";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private ab = 5;
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

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @Body()
    createProductBody: CreateProductBody,
    @GetImageCookie() productImg: ImageGetDto,
    @Res() res: Response,
  ): Promise<JSON<void>> {
    const createProductDto: CreateProductDto = {
      ...createProductBody,
      imgUrl: productImg.url,
    };
    await this.productService.createProduct(createProductDto);

    res.clearCookie("imageUrl");

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
    };
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Patch("/qi")
  async modifyProduct(
    @Query("id")
    id: string,
    @Body() modifyProductDto: ModifyProductDto,
  ): Promise<JSON<void>> {
    await this.productService.modifyProduct(id, modifyProductDto);

    return {
      statusCode: 201,
      message: `${id}에 해당하는 상품을 수정하였습니다.`,
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
