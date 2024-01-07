import { Injectable } from "@nestjs/common";
import { UploadMediaDto } from "../dto/upload-media.dto";
import { ProductImageEntity } from "../entities/product-image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";

@Injectable()
export class MediaUpdateRepository {
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
  ) {}

  // General
  uploadProductImages(
    uploadMediaDto: UploadMediaDto,
  ): Promise<ProductImageEntity> {
    return this.productImageRepository.save(uploadMediaDto);
  }

  // General
  uploadReviewImage(
    uploadMediaDto: UploadMediaDto,
  ): Promise<ReviewImageEntity> {
    return this.reviewImageRepository.save(uploadMediaDto);
  }

  // General
  uploadReviewVideo(
    uploadMediaDto: UploadMediaDto,
  ): Promise<ReviewVideoEntity> {
    return this.reviewVideoRepository.save(uploadMediaDto);
  }

  // General
  uploadInquiryRequestImage(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryRequestImageEntity> {
    return this.inquiryRequestImageRepository.save(uploadMediaDto);
  }

  // General
  uploadInquiryRequestVideo(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryRequestVideoEntity> {
    return this.inquiryRequestVideoRepository.save(uploadMediaDto);
  }

  // General
  uploadInquiryResponseImages(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryResponseImageEntity> {
    return this.inquiryResponseImageRepository.save(uploadMediaDto);
  }

  // General
  uploadInquiryResponseVideos(
    uploadMediaDto: UploadMediaDto,
  ): Promise<InquiryResponseVideoEntity> {
    return this.inquiryResponseVideoRepository.save(uploadMediaDto);
  }

  // General
  async deleteProductImageWithId(id: string): Promise<void> {
    await this.productImageRepository.delete({ id });
  }

  // General
  async deleteReviewImageWithId(id: string): Promise<void> {
    await this.reviewImageRepository.delete({ id });
  }

  // General
  async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.reviewVideoRepository.delete({ id });
  }

  // General
  async deleteInquiryRequestImageWithId(id: string): Promise<void> {
    await this.inquiryRequestImageRepository.delete({ id });
  }

  // General
  async deleteInquiryRequestVideoWithId(id: string): Promise<void> {
    await this.inquiryRequestVideoRepository.delete({ id });
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
