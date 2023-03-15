import { UploadMediaDto } from "../dto/upload-media.dto";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { mediaSelectProperty } from "src/common/config/repository-select-configs/media-select";
import { InquiryImageEntity } from "../entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../entities/inquiry.video.entity";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class MediaGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryImageEntity)
    private readonly inquiryImageRepository: Repository<InquiryImageEntity>,
    @InjectRepository(InquiryVideoEntity)
    private readonly inquiryVideoRepository: Repository<InquiryVideoEntity>,
  ) {
    super("Media General");
  }

  private readonly select = mediaSelectProperty;

  async uploadProductImage(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.productImageRepository
        .createQueryBuilder()
        .insert()
        .into(ProductImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadReviewImage(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.reviewImageRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadReviewVideo(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.reviewVideoRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewVideoEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadInquiryImage(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.inquiryImageRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadInquiryVideo(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.inquiryVideoRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryVideoEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findProductImageWithUrl(url: string): Promise<ProductImageEntity> {
    try {
      return await this.productImageRepository
        .createQueryBuilder()
        .select(this.select.productImagesSelect)
        .from(ProductImageEntity, "product_image")
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
      return await this.reviewImageRepository
        .createQueryBuilder()
        .select(this.select.reviewImagesSelect)
        .from(ReviewImageEntity, "review_image")
        .leftJoin("review_image.Review", "Review")
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
      return await this.reviewVideoRepository
        .createQueryBuilder()
        .select(this.select.reviewVideosSelect)
        .from(ReviewVideoEntity, "review_video")
        .leftJoin("review_video.Review", "Review")
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
      await this.productImageRepository
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
      await this.reviewImageRepository
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
      await this.reviewVideoRepository
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
      await this.reviewVideoRepository
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

  async findProductImageEvenUse(id: string): Promise<ProductImageEntity> {
    try {
      return await this.productImageRepository
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
      return await this.reviewImageRepository
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
      return await this.reviewImageRepository
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
      return await this.reviewVideoRepository
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
      return await this.reviewVideoRepository
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
