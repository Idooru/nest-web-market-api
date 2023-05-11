import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { CreateProductDto } from "../../dto/create-product.dto";
import { ProductEntity } from "../../entities/product.entity";
import { InsertResult } from "typeorm";
import { ModifyProductDto } from "../../dto/modify-product.dto";

export interface IProductGeneralRepository {
  findProductsAllId(): Promise<ProductEntity[]>;
  findAllProductsFromLatest(): Promise<ProductEntity[]>;
  findAllProductsFromOldest(): Promise<ProductEntity[]>;
  findOneProductByName(name: string): Promise<ProductEntity>;
  findOneProductById(id: string): Promise<ProductEntity>;
  findProductOneJustNeedStarRate(id: string): Promise<ProductEntity>;
  createProduct(
    createProductDto: CreateProductDto,
    admin: AdminUserEntity,
  ): Promise<InsertResult>;
  modifyProduct(id: string, modifyProductDto: ModifyProductDto): Promise<void>;
  modifyProductName(id: string, name: string): Promise<void>;
  modifyProductPrice(id: string, price: string): Promise<void>;
  modifyProductOrigin(id: string, origin: string): Promise<void>;
  modifyProductType(id: string, type: string): Promise<void>;
  modifyProductDescription(id: string, description: string): Promise<void>;
  modifyProductQuantity(id: string, quantity: string): Promise<void>;
  removeProduct(id: string): Promise<void>;
}