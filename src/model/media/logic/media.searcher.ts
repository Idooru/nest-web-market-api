import { Injectable } from "@nestjs/common";
import { MediaSearchRepository } from "../repositories/media-search.repository";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { ProductImageEntity } from "../entities/product-image.entity";
import { MediaDto } from "../dto/media.dto";

@Injectable()
export class MediaSearcher {
  constructor(
    private readonly mediaSearchRepository: MediaSearchRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async findProductImageWithUrl(
    productImgCookies: MediaDto[],
  ): Promise<ProductImageEntity[]> {
    const findWork = productImgCookies.map(async (productImgCookie) => {
      return await this.mediaSearchRepository.findProductImageWithUrl(
        productImgCookie.url,
      );
    });

    const productImages = await Promise.all(findWork);
    this.validateLibrary.isExistArray(productImages);
    return productImages;
  }

  async findBeforeProductImageWithId(
    id: string,
  ): Promise<ProductImageEntity[]> {
    const productImages =
      await this.mediaSearchRepository.findBeforeProductImagesWithId(id);
    this.validateLibrary.isExistArray(productImages);
    return productImages;
  }
}
