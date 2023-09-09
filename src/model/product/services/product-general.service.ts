import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { Injectable } from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { ProductInsertRepository } from "../repositories/product-insert.repository";
import { ProductAccessoryService } from "./product-accessory.service";
import { IProductGeneralService } from "../interfaces/services/product-general-service.interface";
import { ProductCategory } from "../types/product-category.type";
import { CreateProductDto } from "../dto/create-product-dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";

@Injectable()
export class ProductGeneralService implements IProductGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userSearcher: UserSearcher,
    private readonly productInsertRepository: ProductInsertRepository,
    private readonly productAccessoryService: ProductAccessoryService,
  ) {}

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromLatest();
    this.productAccessoryService.isExistProducts(founds);
    return founds;
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromOldest();
    this.productAccessoryService.isExistProducts(founds);
    return founds;
  }

  async findProductByName(name: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findOneProductByName(name);
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findOneProductById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { productDto, jwtPayload } = createProductDto;

    const admin = await this.userSearcher.findAdminUserObjectWithId(
      jwtPayload.userId,
    );

    const productOutput = await this.productGeneralRepository.createProduct({
      productDto,
      admin,
    });

    const productId = productOutput.generatedMaps[0].id;

    const product = await this.productInsertRepository.findOneProductById(
      productId,
    );

    await this.productInsertRepository.insertProductIdOnAdminUser(
      admin,
      product,
    );

    return product;
  }

  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    await this.productGeneralRepository.modifyProduct(modifyProductDto);
  }

  async modifyProductName(id: string, name: string): Promise<void> {
    await this.productGeneralRepository.modifyProductName(id, name);
  }

  async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productGeneralRepository.modifyProductPrice(id, price);
  }

  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productGeneralRepository.modifyProductOrigin(id, origin);
  }

  async modifyProductCategory(
    id: string,
    type: ProductCategory,
  ): Promise<void> {
    await this.productGeneralRepository.modifyProductCategory(id, type);
  }

  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productGeneralRepository.modifyProductDescription(
      id,
      description,
    );
  }

  async modifyProductQuantity(id: string, quantity: number): Promise<void> {
    await this.productGeneralRepository.modifyProductQuantity(id, quantity);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productGeneralRepository.removeProduct(id);
  }
}
