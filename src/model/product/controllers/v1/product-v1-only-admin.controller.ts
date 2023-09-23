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
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "../../entities/product.entity";
import { MediaDto } from "src/model/media/dto/media.dto";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { ModifyProductNameDto } from "../../dto/modify-product-name.dto";
import { ModifyProductPriceDto } from "../../dto/modify-product-price.dto";
import { ModifyProductOriginDto } from "../../dto/modify-product-origin.dto";
import { ModifyProductDesctiptionDto } from "../../dto/modify-product-description.dto";
import { ModifyProductQuantityDto } from "../../dto/modify-product-quantity.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ModifyProductCategoryDto } from "../../dto/modify-product-category.dto";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { ProductTransaction } from "../../logic/transaction/product.transaction";
import { ProductSearcher } from "../../logic/product.searcher";
import { ProductBodyDto } from "../../dto/product-body.dto";
import { ProductOperationService } from "../../services/product-operation.service";
import { ProductNameValidatePipe } from "../../pipe/none-exist/product-name-validate.pipe";
import { ProductIdValidatePipe } from "../../pipe/exist/product-id-validate.pipe";

@ApiTags("v1 관리자 Product API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/product")
export class ProductVersionOneOnlyAdminController {
  constructor(
    private readonly productSearcher: ProductSearcher,
    private readonly productTransaction: ProductTransaction,
    private readonly productOperationService: ProductOperationService,
  ) {}
  @ApiOperation({
    summary: "find product by id",
    description:
      "상품의 아이디에 해당하는 상품 정보를 가져옵니다. 상품의 아이디와 일치하는 row가 데이터베이스에 존재하지 않을 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:id")
  async findProductWithId(
    @Param("id", ProductIdValidatePipe) id: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    const result = await this.productSearcher.findProductWithId(id);

    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result,
    };
  }

  @ApiOperation({
    summary: "create product",
    description:
      "상품을 생성합니다. 생성하려는 상품의 이름이 이미 데이터베이스에 존재하거나 가격, 수량을 양의 정수 이외의 숫자로 지정하면 에러를 반환합니다. 이 api를 실행하기 전에 무조건 상품 이미지를 하나 업로드해야 합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Post("/")
  async createProduct(
    @MediaCookiesParser(productMediaCookieKey.image_url_cookie)
    productImgCookies: MediaDto[],
    @Body(ProductNameValidatePipe) productBodyDto: ProductBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.productTransaction.createProduct({
      productBodyDto,
      jwtPayload,
      productImgCookies,
    });

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
      cookieKey: [...productImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify product",
    description:
      "상품의 아이디에 해당하는 상품의 전체 column, 상품에 사용되는 이미지를 수정합니다. 수정하려는 상품의 가격, 수량을 양의 정수 이외의 숫자로 지정하거나 수정하려는 상품의 이름이 이미 데이터베이스에 존재 한다면 에러를 반환합니다. 이 api를 실행하기 전에 무조건 상품 이미지를 업로드해야 합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_not_exist.name_executed,
    ),
  )
  @Put("/:id")
  async modifyProduct(
    @MediaCookiesParser(productMediaCookieKey.image_url_cookie)
    productImgCookies: MediaDto[],
    @Param("id", ProductIdValidatePipe) id: string,
    @Body(ProductNameValidatePipe) productBodyDto: ProductBodyDto,
  ): Promise<JsonClearCookiesInterface> {
    await this.productTransaction.modifyProduct({
      id,
      productBodyDto,
      productImgCookies,
    });

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품을 수정하였습니다.`,
      cookieKey: [...productImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify product image",
    description:
      "상품의 아이디에 해당하는 상품에 사용되는 이미지를 수정합니다. 이 api를 실행하기 전에 무조건 상품 이미지를 생성해야 합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Patch("/:id/image")
  async modifyProductImage(
    @MediaCookiesParser(productMediaCookieKey.image_url_cookie)
    productImgCookies: MediaDto[],
    @Param("id", ProductIdValidatePipe) id: string,
  ): Promise<JsonClearCookiesInterface> {
    await this.productTransaction.modifyProductImage(id, productImgCookies);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 사진을 수정하였습니다.`,
      cookieKey: [...productImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify product name",
    description:
      "상품의 아이디에 해당하는 상품의 이름 column을 수정합니다. 수정하려는 상품의 이름이 이미 데이터베이스에 존재 한다면 에러를 반환합니다. ",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/name")
  async modifyProductName(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body(ProductNameValidatePipe) { name }: ModifyProductNameDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.modifyProductName(id, name);
    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 이름을 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "modify product price",
    description:
      "상품의 아이디에 해당하는 상품의 가격 column을 수정합니다. 수정하려는 상품의 가격을 양의 정수 이외의 숫자로 지정하면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/price")
  async modifyProductPrice(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body() { price }: ModifyProductPriceDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.modifyProductPrice(id, price);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 가격을 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "modify product origin",
    description: "상품의 아이디에 해당하는 상품의 원산지 column을 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/origin")
  async modifyProductOrigin(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body() { origin }: ModifyProductOriginDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.modifyProductOrigin(id, origin);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 원산지를 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "modify product category",
    description: "상품 아이디에 해당하는 상품의 카테고리 column을 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/category")
  async modifyProductCategory(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body() { category }: ModifyProductCategoryDto,
  ) {
    await this.productOperationService.modifyProductCategory(id, category);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 카테고리를 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "modify product description",
    description: "상품의 아이디에 해당하는 상품의 설명 column을 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/description")
  async modifyProductDescription(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body() { description }: ModifyProductDesctiptionDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.modifyProductDescription(
      id,
      description,
    );

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 설명을 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "modify product quantity",
    description:
      "상품의 아이디에 해당하는 상품의 수량 column을 수정합니다. 수정하려는 상품의 수량을 양의 정수 이외의 숫자로 지정하면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:id/quantity")
  async modifyProductQuantity(
    @Param("id", ProductIdValidatePipe) id: string,
    @Body() { quantity }: ModifyProductQuantityDto,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.modifyProductQuantity(id, quantity);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품의 수량을 수정하였습니다.`,
    };
  }

  @ApiOperation({
    summary: "remove product",
    description: "상품의 아이디에 해당하는 상품을 제거합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:id")
  async removeProduct(
    @Param("id", ProductIdValidatePipe) id: string,
  ): Promise<JsonGeneralInterface<null>> {
    await this.productOperationService.removeProduct(id);

    return {
      statusCode: 201,
      message: `id(${id})에 해당하는 상품을 제거하였습니다.`,
    };
  }
}
