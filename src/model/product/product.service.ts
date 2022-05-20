import { HttpExceptionFilter } from "./../../filter/http-exception.filter";
import {
  Injectable,
  HttpException,
  HttpStatus,
  UsePipes,
} from "@nestjs/common";
import { Product } from "./interfaces/product.interface";
import { Json } from "./interfaces/json.interface";
import { AllRouterIdDto } from "./dto/all_query_id.dto";
import { CreateProductDto } from "./dto/create_product.dto";
import { GetProductDto } from "./dto/get_product.dto";
import { ModifyProductDto } from "./dto/modify_product.dto";

@UsePipes(HttpExceptionFilter)
@Injectable() // 의존성 주입이 가능함, 즉 제공자로써 사용 가능
export class ProductService {
  private products: Product[] = []; // 상품을 의미하는 메모리 형태의 데이터

  // 전체 상품을 불러오는 서비스
  getProductAll(): Json {
    if (!this.products.length) {
      throw new HttpException(
        `Fail to get products, No product in database`,
        501,
      );
    }

    return {
      statusCode: 200,
      success: false,
      message: `get all products`,
      result: this.products,
    };
  }

  // 쿼리(상품 이름)를 통해 상품을 불러오는 서비스
  getProductByName(getProductDtoName: GetProductDto): Json {
    const { name } = getProductDtoName;
    const found = this.products.find((product) => product.name === name);

    if (!found) {
      throw new HttpException(`Fail to get product, ${name} is not exist`, 404);
    }

    return {
      statusCode: 200,
      success: true,
      message: `get product by name ${name}`,
      result: found,
    };
  }

  // 쿼리(상품 아이디)를 통해 상품을 불러오는 서비스
  getProductById(allRouterIdDto: AllRouterIdDto): Json {
    const { id } = allRouterIdDto;
    const found = this.products.find((product) => product.id === id);

    if (!found) {
      throw new HttpException(`Fail to get product, ${id} is not exist`, 404);
    }

    return {
      statusCode: 201,
      success: true,
      message: ` get product by id ${id}`,
      result: found,
    };
  }

  // 상품을 생성하는 서비스
  createProduct(createProductDto: CreateProductDto): Json {
    const { name, price, origin, type, description } = createProductDto;

    const product: Product = {
      id: Date.now().toString(),
      name,
      price,
      origin,
      type,
      description,
    };

    this.products.push(product);

    return {
      statusCode: 201,
      success: true,
      message: `create product ${name}`,
      result: product,
    };
  }

  // 쿼리(상품 아이디)를 통해 상품을 부분 수정하는 서비스
  modifyProduct(
    allRouterIdDto: AllRouterIdDto,
    modifyProductDto: ModifyProductDto,
  ): Json {
    const { name, price, origin, type, description } = modifyProductDto;
    const { id } = allRouterIdDto;

    const found = this.products.find((product) => product.id === id);

    if (!found) {
      throw new HttpException(
        `Fail to modify product, ${id} is not exist`,
        404,
      );
    }

    const idx = this.products.indexOf(found);
    this.products[idx].name = name;
    this.products[idx].price = price;
    this.products[idx].origin = origin;
    this.products[idx].type = type;
    this.products[idx].description = description;

    return {
      statusCode: 200,
      success: true,
      message: `modify product by id ${id}`,
      result: found,
    };
  }

  // 쿼리(상품 아이디)를 통해 상품을 삭제하는 서비스
  removeProduct(allRouterIdDto: AllRouterIdDto): Json {
    const { id } = allRouterIdDto;
    const found = this.products.find((product) => product.id === id);

    if (!found) {
      throw new HttpException(
        `Fail to remove product, ${id} is not exist`,
        404,
      );
    }

    this.products = this.products.filter((product) => product.id !== id);

    return {
      statusCode: 200,
      success: true,
      message: `remove product by id ${id}`,
    };
  }
}
