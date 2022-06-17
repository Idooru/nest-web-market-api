import { PickType } from "@nestjs/mapped-types";
import { ProductEntity } from "../product.entity";

export class ResponseProductDto extends PickType(ProductEntity, [
  "id",
  "name",
  "price",
  "origin",
  "type",
  "description",
  "imgUrl",
  "rating",
  "createdAt",
  "updatedAt",
] as const) {}

export class ResponseProductsDto extends PickType(ProductEntity, [
  "id",
  "name",
  "price",
  "origin",
  "type",
  "imgUrl",
  "rating",
] as const) {}

export const ProductReturnFilter = (
  product: ProductEntity,
): ResponseProductDto => ({
  id: product.id,
  name: product.name,
  price: product.price,
  origin: product.origin,
  type: product.type,
  description: product.description,
  imgUrl: product.imgUrl,
  rating: product.rating,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const ProductsReturnFilter = (
  products: ProductEntity[],
): ResponseProductsDto[] =>
  products.map((idx) => ({
    id: idx.id,
    name: idx.name,
    price: idx.price,
    origin: idx.origin,
    type: idx.type,
    imgUrl: idx.imgUrl,
    rating: idx.rating,
  }));
