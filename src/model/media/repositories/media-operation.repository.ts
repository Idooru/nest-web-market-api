import { Injectable } from "@nestjs/common";
import { UploadMediaDto } from "../dto/upload-media.dto";
import { ProductImageEntity } from "../entities/product-image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class MediaOperationRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(InquiryResponseImageEntity)
    private readonly inquiryResponseImageRepository: Repository<InquiryResponseImageEntity>,
    @InjectRepository(InquiryResponseVideoEntity)
    private readonly inquiryResponseVideoRepository: Repository<InquiryResponseVideoEntity>,
  ) {}

  // General
  async uploadProductImages(
    uploadMediaDto: UploadMediaDto,
  ): Promise<ProductImageEntity> {
    return await this.productImageRepository.save({ ...uploadMediaDto });
  }

  // General
  async uploadInquiryResponseImages(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryResponseImageEntity> {
    return await this.inquiryResponseImageRepository.save({
      ...uploadMediaDto,
    });
  }

  // General
  async uploadInquiryResponseVideos(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryResponseVideoEntity> {
    return await this.inquiryResponseVideoRepository.save({
      ...uploadMediaDto,
    });
  }

  // General
  async deleteProductImageWithId(id: string): Promise<void> {
    await this.productImageRepository.delete({ id });
  }

  // General
  async deleteInquiryResponseImageWithId(id: string): Promise<void> {
    await this.inquiryResponseImageRepository.delete({ id });
  }

  // General
  async deleteInquiryResponseVideoWithId(id: string): Promise<void> {
    await this.inquiryResponseVideoRepository.delete({ id });
  }
}
