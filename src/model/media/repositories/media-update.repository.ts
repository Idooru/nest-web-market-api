import { Injectable } from "@nestjs/common";
import { ProductImageEntity } from "../entities/product-image.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { General } from "../../../common/decorators/general.decoration";
import { UploadMediaDto } from "../dto/request/upload-media.dto";

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

  @General
  public async uploadProductImages(dto: UploadMediaDto): Promise<ProductImageEntity> {
    return this.productImageRepository.save(dto);
  }

  @General
  public uploadReviewImage(dto: UploadMediaDto): Promise<ReviewImageEntity> {
    return this.reviewImageRepository.save(dto);
  }

  @General
  public uploadReviewVideo(dto: UploadMediaDto): Promise<ReviewVideoEntity> {
    return this.reviewVideoRepository.save(dto);
  }

  @General
  public uploadInquiryRequestImage(dto: UploadMediaDto): Promise<InquiryRequestImageEntity> {
    return this.inquiryRequestImageRepository.save(dto);
  }

  @General
  public uploadInquiryRequestVideo(dto: UploadMediaDto): Promise<InquiryRequestVideoEntity> {
    return this.inquiryRequestVideoRepository.save(dto);
  }

  @General
  public uploadInquiryResponseImages(dto: UploadMediaDto): Promise<InquiryResponseImageEntity> {
    return this.inquiryResponseImageRepository.save(dto);
  }

  @General
  public uploadInquiryResponseVideos(dto: UploadMediaDto): Promise<InquiryResponseVideoEntity> {
    return this.inquiryResponseVideoRepository.save(dto);
  }

  @General
  public async deleteProductImageWithId(id: string): Promise<void> {
    await this.productImageRepository.delete({ id });
  }

  @General
  public async deleteReviewImageWithId(id: string): Promise<void> {
    await this.reviewImageRepository.delete({ id });
  }

  @General
  public async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.reviewVideoRepository.delete({ id });
  }

  @General
  public async deleteInquiryRequestImageWithId(id: string): Promise<void> {
    await this.inquiryRequestImageRepository.delete({ id });
  }

  @General
  public async deleteInquiryRequestVideoWithId(id: string): Promise<void> {
    await this.inquiryRequestVideoRepository.delete({ id });
  }

  @General
  public async deleteInquiryResponseImageWithId(id: string): Promise<void> {
    await this.inquiryResponseImageRepository.delete({ id });
  }

  @General
  public async deleteInquiryResponseVideoWithId(id: string): Promise<void> {
    await this.inquiryResponseVideoRepository.delete({ id });
  }
}
