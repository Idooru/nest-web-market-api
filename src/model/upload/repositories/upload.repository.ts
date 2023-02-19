import { MediaUploadDto } from "../dto/media-upload.dto";
import { MediaReturnDto } from "../dto/media-return.dto";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InquiryImageEntity } from "src/model/inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/inquiry/entities/inquiry.video.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { mediaSelectProperty } from "src/common/config/repository-select-configs/media-select";

@UseFilters(InternalServerErrorException)
@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productsImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewsImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewsVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryImageEntity)
    private readonly inquiryImageRepository: Repository<InquiryImageEntity>,
    @InjectRepository(InquiryVideoEntity)
    private readonly inquiryVideoRepository: Repository<InquiryVideoEntity>,
    private readonly configService: ConfigService,
  ) {}

  private readonly select = mediaSelectProperty;

  async uploadProductImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${media}`.toLowerCase();

    await this.productsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadReviewImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${new ConfigService().get(
      "APPLICATION_PORT",
    )}/media/${media}`.toLowerCase();

    await this.reviewsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadReviewVideo(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${new ConfigService().get(
      "APPLICATION_PORT",
    )}/media/${media}`.toLowerCase();

    await this.reviewsVideoRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadInquiryImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${new ConfigService().get(
      "APPLICATION_PORT",
    )}/media/${media}`.toLowerCase();

    await this.inquiryImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadInquiryVideo(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${new ConfigService().get(
      "APPLICATION_PORT",
    )}/media/${media}`.toLowerCase();

    await this.inquiryVideoRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async findProductImageWithUrl(url: string): Promise<ProductImageEntity> {
    try {
      return await this.productsImageRepository
        .createQueryBuilder()
        .select(this.select.productImagesSelect)
        .from(ProductImageEntity, "product_image")
        .leftJoin("product_image.uploader", "uploader")
        .where("product_image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 상품 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findReviewImageWithUrl(url: string): Promise<ReviewImageEntity> {
    try {
      return await this.reviewsImageRepository
        .createQueryBuilder()
        .select(this.select.reviewImagesSelect)
        .from(ReviewImageEntity, "review_image")
        .leftJoin("review_image.Review", "Review")
        .innerJoin("review_image.uploader", "uploader")
        .where("review_image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 리뷰 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findReviewVideoWithUrl(url: string): Promise<ReviewVideoEntity> {
    try {
      return await this.reviewsVideoRepository
        .createQueryBuilder()
        .select(this.select.reviewVideosSelect)
        .from(ReviewVideoEntity, "review_video")
        .leftJoin("review_video.Review", "Review")
        .innerJoin("review_video.uploader", "uploader")
        .where("review_video.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 리뷰 동영상을 찾을 수 없습니다.",
      );
    }
  }

  async findInquiryImageWithUrl(url: string): Promise<InquiryImageEntity> {
    try {
      return await this.inquiryImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryImagesSelect)
        .from(InquiryImageEntity, "inquiry_image")
        .leftJoin("inquiry_image.Inquiry", "Inquiry")
        .innerJoin("inquiry_image.uploader", "uploader")
        .where("inquiry_image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 문의 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findInquiryVideoWithUrl(url: string): Promise<InquiryVideoEntity> {
    try {
      return await this.inquiryVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryVideosSelect)
        .from(InquiryVideoEntity, "inquiry_video")
        .leftJoin("inquiry_video.Inquiry", "Inquiry")
        .innerJoin("inquiry_video.uploader", "uploader")
        .where("inquiry_video.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 문의 동영상을 찾을 수 없습니다.",
      );
    }
  }

  async deleteProductImageWithId(id: string): Promise<void> {
    await this.productsImageRepository
      .createQueryBuilder()
      .delete()
      .from(ProductImageEntity, "product_image")
      .where("id = :id", { id })
      .execute();
  }

  async deleteReviewImageWithId(id: string): Promise<void> {
    await this.reviewsImageRepository
      .createQueryBuilder()
      .delete()
      .from(ReviewImageEntity, "review_image")
      .where("id = :id", { id })
      .execute();
  }

  async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.reviewsVideoRepository
      .createQueryBuilder()
      .delete()
      .from(ReviewVideoEntity, "review_video")
      .where("id = :id", { id })
      .execute();
  }

  async deleteInquiryImageWithId(id: string): Promise<void> {
    await this.inquiryImageRepository
      .createQueryBuilder()
      .delete()
      .from(InquiryImageEntity, "inquiry_image")
      .where("id = :id", { id })
      .execute();
  }

  async deleteInquiryVideoWithId(id: string): Promise<void> {
    await this.reviewsVideoRepository
      .createQueryBuilder()
      .delete()
      .from(InquiryVideoEntity, "inquiry_video")
      .where("id = :id", { id })
      .execute();
  }

  async insertImageOnReview(id: string, review: ReviewEntity) {
    const image = await this.reviewsImageRepository
      .createQueryBuilder("image")
      .where("image.id = :id", { id })
      .getOne();

    image.Review = review;
    await this.reviewsImageRepository.save(image);
  }

  async insertVideoOnReview(id: string, review: ReviewEntity) {
    const video = await this.reviewsVideoRepository
      .createQueryBuilder("video")
      .where("video.id = :id", { id })
      .getOne();

    video.Review = review;
    await this.reviewsVideoRepository.save(video);
  }

  async insertProductIdOnProductImage(
    image: ProductImageEntity,
    product: ProductEntity,
  ) {
    await this.productsImageRepository
      .createQueryBuilder()
      .update(ProductImageEntity)
      .set({ Product: product })
      .where("id = :id", { id: image.id })
      .execute();
  }

  async findProductImageEvenUse(id: string) {
    return await this.productsImageRepository
      .createQueryBuilder()
      .select("products_images")
      .from(ProductImageEntity, "products_images")
      .where("products_images.Product = :Product", {
        Product: id,
      })
      .getOne();
  }
}
