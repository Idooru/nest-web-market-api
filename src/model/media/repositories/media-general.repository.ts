import { UploadMediaDto } from "../dto/upload-media.dto";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { mediaSelectProperty } from "src/common/config/repository-select-configs/media-select";
import { InquiryImageEntity } from "../entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../entities/inquiry.video.entity";

@Injectable()
export class MediaGeneralRepository {
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
  ) {}

  private readonly logger = new Logger("Repository");
  private readonly select = mediaSelectProperty;

  async uploadProductImage(mediaUploadDto: UploadMediaDto): Promise<void> {
    try {
      await this.productsImageRepository
        .createQueryBuilder()
        .insert()
        .into(ProductImageEntity)
        .values({ ...mediaUploadDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadReviewImage(mediaUploadDto: UploadMediaDto): Promise<void> {
    try {
      await this.reviewsImageRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewImageEntity)
        .values({ ...mediaUploadDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadReviewVideo(mediaUploadDto: UploadMediaDto): Promise<void> {
    try {
      await this.reviewsVideoRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewVideoEntity)
        .values({ ...mediaUploadDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadInquiryImage(mediaUploadDto: UploadMediaDto): Promise<void> {
    try {
      await this.inquiryImageRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryImageEntity)
        .values({ ...mediaUploadDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadInquiryVideo(mediaUploadDto: UploadMediaDto): Promise<void> {
    try {
      await this.inquiryVideoRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryVideoEntity)
        .values({ ...mediaUploadDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
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
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          "해당 url을 가진 상품 이미지를 찾을 수 없습니다.",
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 리뷰 이미지를 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 리뷰 동영상을 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 이미지를 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 동영상을 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteProductImageWithId(id: string): Promise<void> {
    try {
      await this.productsImageRepository
        .createQueryBuilder()
        .delete()
        .from(ProductImageEntity, "product_image")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteReviewImageWithId(id: string): Promise<void> {
    try {
      await this.reviewsImageRepository
        .createQueryBuilder()
        .delete()
        .from(ReviewImageEntity, "review_image")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteReviewVideoWithId(id: string): Promise<void> {
    try {
      await this.reviewsVideoRepository
        .createQueryBuilder()
        .delete()
        .from(ReviewVideoEntity, "review_video")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteInquiryImageWithId(id: string): Promise<void> {
    try {
      await this.inquiryImageRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryImageEntity, "inquiry_image")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteInquiryVideoWithId(id: string): Promise<void> {
    try {
      await this.reviewsVideoRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryVideoEntity, "inquiry_video")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertProductIdOnProductImage(
    image: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    try {
      await this.productsImageRepository
        .createQueryBuilder()
        .update(ProductImageEntity)
        .set({ Product: product })
        .where("id = :id", { id: image.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertReviewIdOnReviewImage(
    image: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewsImageRepository
        .createQueryBuilder()
        .update(ReviewImageEntity)
        .set({ Review: review })
        .where("id = :id", { id: image.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertReviewIdOnReviewVideo(
    video: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewsVideoRepository
        .createQueryBuilder()
        .update(ReviewVideoEntity)
        .set({ Review: review })
        .where("id = :id", { id: video.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findProductImageEvenUse(id: string): Promise<ProductImageEntity> {
    try {
      return await this.productsImageRepository
        .createQueryBuilder()
        .select("products_images.id")
        .from(ProductImageEntity, "products_images")
        .where("products_images.Product = :Product", {
          Product: id,
        })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findBeforeReviewImages(id: string): Promise<ReviewImageEntity[]> {
    try {
      return await this.reviewsImageRepository
        .createQueryBuilder()
        .select("reviews_images.id")
        .from(ReviewImageEntity, "reviews_images")
        .where("reviews_images.Review = :Review", { Review: id })
        .orderBy("reviews_images.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findBeforeReviewImage(id: string): Promise<ReviewImageEntity> {
    try {
      return await this.reviewsImageRepository
        .createQueryBuilder()
        .select("reviews_image.id")
        .from(ReviewImageEntity, "reviews_image")
        .where("reviews_image.Review = :Review", { Review: id })
        .orderBy("reviews_image.createdAt", "DESC")
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findBeforeReviewVideos(id: string): Promise<ReviewVideoEntity[]> {
    try {
      return await this.reviewsVideoRepository
        .createQueryBuilder()
        .select("reviews_videos.id")
        .from(ReviewVideoEntity, "reviews_videos")
        .where("reviews_videos.Review = :Review", { Review: id })
        .orderBy("reviews_videos.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findBeforeReviewVideo(id: string): Promise<ReviewVideoEntity> {
    try {
      return await this.reviewsVideoRepository
        .createQueryBuilder()
        .select("reviews_video.id")
        .from(ReviewVideoEntity, "reviews_video")
        .where("reviews_video.Review = :Review", { Review: id })
        .orderBy("reviews_video.createdAt", "DESC")
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
