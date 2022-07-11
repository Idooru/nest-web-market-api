import { PickType } from "@nestjs/mapped-types";
import { ProductEntity } from "../entities/product.entity";

export class ResponseProductDto extends PickType(ProductEntity, [
  "id",
  "name",
  "price",
  "origin",
  "type",
  "description",
  "image",
  "createdAt",
  "updatedAt",
] as const) {}

export class ResponseProductsDto extends PickType(ProductEntity, [
  "name",
  "price",
  "type",
  "image",
] as const) {}

// export const ProductReturnFilter = (
//   product: ProductEntity,
// ): ResponseProductDto => {
//   console.log(1);
//   return {
//     id: product.id,
//     name: product.name,
//     price: product.price,
//     origin: product.origin,
//     type: product.type,
//     description: product.description,
//     image: product.image,
//     starRating: product.starRating,
//     createdAt: product.createdAt,
//     updatedAt: product.updatedAt,
//   };
// };

// export const ProductsReturnFilter = (
//   products: ProductEntity[],
// ): ResponseProductsDto[] =>
//   products.map((idx) => ({
//     name: idx.name,
//     price: idx.price,
//     type: idx.type,
//     image: idx.image,
//     starRating: idx.starRating,
//   }));
