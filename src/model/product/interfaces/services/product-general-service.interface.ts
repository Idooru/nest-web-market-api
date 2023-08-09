import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductEntity } from "../../entities/product.entity";
import { CreateProductDto } from "../../dto/create-product-dto";

export interface IProductGeneralService {
  findAllProductsFromLatest(): Promise<ProductEntity[]>;
  findAllProductsFromOldest(): Promise<ProductEntity[]>;
  findProductByName(name: string): Promise<ProductEntity>;
  findProductById(id: string): Promise<ProductEntity>;
  createProduct(createProductDto: CreateProductDto): Promise<ProductEntity>;
  modifyProduct(modifyProductDto: ModifyProductDto): Promise<void>;
  modifyProductName(id: string, name: string): Promise<void>;
  modifyProductPrice(id: string, price: number): Promise<void>;
  modifyProductOrigin(id: string, origin: string): Promise<void>;
  modifyProductCategory(id: string, type: string): Promise<void>;
  modifyProductDescription(id: string, description: string): Promise<void>;
  modifyProductQuantity(id: string, quantity: number): Promise<void>;
  removeProduct(id: string): Promise<void>;
}
