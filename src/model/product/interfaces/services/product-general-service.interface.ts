import { MediaDto } from "src/model/media/dto/media.dto";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductEntity } from "../../entities/product.entity";
import { CreateProductDto } from "../../dto/create-product.dto";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";

export interface IProductGeneralService {
  findProductsAllId(): Promise<ProductEntity[]>;
  findAllProductsFromLatest(): Promise<ProductEntity[]>;
  findAllProductsFromOldest(): Promise<ProductEntity[]>;
  findProductByName(name: string): Promise<ProductEntity>;
  findProductById(id: string): Promise<ProductEntity>;
  createProduct(
    createProductDto: CreateProductDto,
    imageCookie: MediaDto,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void>;
  modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaDto,
  ): Promise<void>;
  modifyProductImage(id: string, imageCookie: MediaDto): Promise<void>;
  modifyProductName(id: string, name: string): Promise<void>;
  modifyProductPrice(id: string, price: string): Promise<void>;
  modifyProductOrigin(id: string, origin: string): Promise<void>;
  modifyProductType(id: string, type: string): Promise<void>;
  modifyProductDescription(id: string, description: string): Promise<void>;
  modifyProductQuantity(id: string, quantity: string): Promise<void>;
  removeProduct(id: string): Promise<void>;
}
