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
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class MediaGeneralRepository extends RepositoryLogger {
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

  async uploadInquiryRequestImage(
    uploadMediaDto: UploadMediaDto,
  ): Promise<void> {
    try {
      await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryRequestImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadInquiryRequestVideo(
    uploadMediaDto: UploadMediaDto,
  ): Promise<void> {
    try {
      await this.inquiryRequestVideoRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryRequestVideoEntity)
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
        .from(ProductImageEntity, "productImage")
        .where("productImage.url = :url", { url })
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
        .from(ReviewImageEntity, "reviewImage")
        .leftJoin("reviewImage.Review", "Review")
        .where("reviewImage.url = :url", { url })
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
        .from(ReviewVideoEntity, "reviewVideo")
        .leftJoin("reviewVideo.Review", "Review")
        .where("reviewVideo.url = :url", { url })
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

  async findInquiryRequestImageWithUrl(
    url: string,
  ): Promise<InquiryRequestImageEntity> {
    try {
      return await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryImagesSelect)
        .from(InquiryRequestImageEntity, "inquiryImage")
        .leftJoin("inquiryImage.Inquiry", "Inquiry")
        .where("inquiryImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 요청 이미지를 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async findInquiryResponseImageWithUrl(
    url: string,
  ): Promise<InquiryResponseImageEntity> {
    try {
      return await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryImagesSelect)
        .from(InquiryResponseImageEntity, "inquiryImage")
        .leftJoin("inquiryImage.Inquiry", "Inquiry")
        .where("inquiryImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 응답 이미지를 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async findInquiryReuqestVideoWithUrl(
    url: string,
  ): Promise<InquiryRequestVideoEntity> {
    try {
      return await this.inquiryRequestVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryVideosSelect)
        .from(InquiryRequestVideoEntity, "inquiryVideo")
        .leftJoin("inquiryVideo.Inquiry", "Inquiry")
        .where("inquiryVideo.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 요청 동영상을 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async findInquiryResponseVideoWithUrl(
    url: string,
  ): Promise<InquiryResponseVideoEntity> {
    try {
      return await this.inquiryResponseVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryVideosSelect)
        .from(InquiryResponseVideoEntity, "inquiryVideo")
        .leftJoin("inquiryVideo.Inquiry", "Inquiry")
        .where("inquiryVideo.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 url(${url})을 가진 문의 응답 동영상을 찾을 수 없습니다.`,
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
        .from(ProductImageEntity, "productImage")
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
        .from(ReviewImageEntity, "reviewImage")
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
        .from(ReviewVideoEntity, "reviewVideo")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteInquiryImageWithId(id: string): Promise<void> {
    try {
      await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryRequestImageEntity, "inquiryRequestImage")
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
        .from(InquiryRequestVideoEntity, "inquiryVideo")
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
        .select("productImages.id")
        .from(ProductImageEntity, "productImages")
        .where("productImages.Product = :Product", {
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
        .select("reviewImages.id")
        .from(ReviewImageEntity, "reviewImages")
        .where("reviewImages.Review = :Review", { Review: id })
        .orderBy("reviewImages.createdAt", "DESC")
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
        .select("reviewImage.id")
        .from(ReviewImageEntity, "reviewImage")
        .where("reviewImage.Review = :Review", { Review: id })
        .orderBy("reviewImage.createdAt", "DESC")
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
        .select("reviewVideos.id")
        .from(ReviewVideoEntity, "reviewVideos")
        .where("reviewVideos.Review = :Review", { Review: id })
        .orderBy("reviewVideos.createdAt", "DESC")
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
        .select("reviewVideo.id")
        .from(ReviewVideoEntity, "reviewVideo")
        .where("reviewVideo.Review = :Review", { Review: id })
        .orderBy("reviewVideo.createdAt", "DESC")
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
