import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product-image.entity";
import { Repository } from "typeorm";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { MediaSelectProperty } from "../../../common/config/repository-select-configs/media.select";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class MediaSearchRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryRequestImageEntity)
    private readonly inquiryRequestImageRepository: Repository<InquiryRequestImageEntity>,
    @InjectRepository(InquiryRequestVideoEntity)
    private readonly inquiryRequestVideoRepository: Repository<InquiryRequestVideoEntity>,
    @InjectRepository(InquiryResponseImageEntity)
    private readonly inquiryResponseImageRepository: Repository<InquiryResponseImageEntity>,
    @InjectRepository(InquiryResponseVideoEntity)
    private readonly inquiryResponseVideoRepository: Repository<InquiryResponseVideoEntity>,
    @Inject("MediaSelectProperty")
    private readonly mediaSelect: MediaSelectProperty,
  ) {}

  async findProductImageWithId(id: string): Promise<ProductImageEntity> {
    return await this.productImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.productImages)
      .from(ProductImageEntity, "productImage")
      .where("productImage.id = :id", { id })
      .getOne();
  }

  async findBeforeProductImagesWithId(
    id: string,
  ): Promise<ProductImageEntity[]> {
    return await this.productImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.productImages)
      .from(ProductImageEntity, "productImage")
      .where("productImage.productId = :productId", { productId: id })
      .getMany();
  }

  async findInquiryResponseImageWithId(
    id: string,
  ): Promise<InquiryResponseImageEntity> {
    return await this.inquiryResponseImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryResponseImages)
      .from(InquiryResponseImageEntity, "inquiryResponseImage")
      .where("inquiryResponseImage.id = :id", { id })
      .getOne();
  }

  async findInquiryResponseVideoWithId(
    id: string,
  ): Promise<InquiryResponseVideoEntity> {
    return await this.inquiryResponseVideoRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryResponseVideos)
      .from(InquiryResponseVideoEntity, "inquiryResponseVideo")
      .where("inquiryResponseVideo.id = :id", { id })
      .getOne();
  }
}
