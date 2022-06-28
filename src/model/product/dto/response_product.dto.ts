import { PickType } from "@nestjs/mapped-types";
import { ProductEntity } from "../product.entity";

export class ResponseProductDto extends PickType(ProductEntity, [
  "id",
  "name",
  "price",
  "origin",
  "type",
  "description",
  "image",
  "rating",
  "createdAt",
  "updatedAt",
] as const) {}

export class ResponseProductsDto extends PickType(ProductEntity, [
  "name",
  "price",
  "type",
  "image",
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
  image: product.image,
  rating: product.rating,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const ProductsReturnFilter = (
  products: ProductEntity[],
): ResponseProductsDto[] =>
  products.map((idx) => ({
    name: idx.name,
    price: idx.price,
    type: idx.type,
    imgUrl: idx.image.uploadedImage,
    rating: idx.rating,
  }));
