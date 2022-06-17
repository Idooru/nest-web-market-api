import { IsAdminGuard } from "./../../../common/guards/isAdmin.guard";
import { IsLoginGuard } from "./../../../common/guards/isLogin.guard";
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { JSON } from "../../../common/interfaces/json.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import {
  ResponseProductDto,
  ResponseProductsDto,
} from "../dto/response_product.dto";
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

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @Post("/")
  async createProduct(
    @IsAdmin()
    @Body()
    createProductDto: CreateProductDto,
  ): Promise<JSON<void>> {
    await this.productService.createProduct(createProductDto);

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
