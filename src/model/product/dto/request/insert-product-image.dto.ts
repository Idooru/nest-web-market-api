import { ProductImageEntity } from "../../../media/entities/product-image.entity";

export class InsertProductImagesDto {
  productId: string;
  productImages: ProductImageEntity[];
}

export class InsertProductImageDto {
  productId: string;
  productImageId: string;
}
