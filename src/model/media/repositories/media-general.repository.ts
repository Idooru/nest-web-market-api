import { UploadMediaDto } from "../dto/upload-media.dto";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { MediaSelectProperty } from "src/common/config/repository-select-configs/media.select";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class MediaGeneralRepository extends ErrorHandlerProps {
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
    @Inject("MediaSelectProperty") private readonly select: MediaSelectProperty,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
  }

  async findUploadedProductImage(
    email: string,
    url: string,
  ): Promise<ProductImageEntity> {
    try {
      return await this.productImageRepository
        .createQueryBuilder()
        .select(this.select.productImages)
        .from(ProductImageEntity, "productImage")
        .where("productImage.url = :url", { url })
        .andWhere("productImage.uploader = :uploader", { uploader: email })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedProductImage.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedReviewImages(
    email: string,
    url: string,
  ): Promise<ReviewImageEntity> {
    try {
      return await this.reviewImageRepository
        .createQueryBuilder()
        .select(this.select.reviewImages)
        .from(ReviewImageEntity, "reviewImage")
        .where("reviewImage.url = :url", { url })
        .andWhere("reviewImage.uploader = :uploader", { uploader: email })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedReviewImages.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedReviewVideos(email: string, url: string) {
    try {
      return await this.reviewVideoRepository
        .createQueryBuilder()
        .select(this.select.reviewVideos)
        .from(ReviewVideoEntity, "reviewVideo")
        .where("reviewVideo.url = :url", { url })
        .andWhere("reviewVideo.uploader = :uploader")
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedReviewImages.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedInquiryReqeustImages(
    email: string,
    url: string,
  ): Promise<InquiryRequestImageEntity> {
    try {
      return await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryRequestImages)
        .from(InquiryRequestImageEntity, "inquiryReqeustImage")
        .where("inquiryReqeustImage.url = :url", { url })
        .andWhere("inquiryReqeustImage.uploader = :uploader", {
          uploader: email,
        })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedReviewImages.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedInquiryReqeustVideos(
    email: string,
    url: string,
  ): Promise<InquiryRequestVideoEntity> {
    try {
      return await this.inquiryRequestVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryRequestVideos)
        .from(InquiryRequestVideoEntity, "inquiryRequestVideo")
        .where("inquiryRequestVideo.url = :url", { url })
        .andWhere("inquiryRequestVideo.uploader = :uploader", {
          uploader: email,
        })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedReviewImages.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedInquiryResponseImages(
    email: string,
    url: string,
  ): Promise<InquiryResponseImageEntity> {
    try {
      return await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryResponseImages)
        .from(InquiryResponseImageEntity, "inquiryResponseImage")
        .where("inquiryResponseImage.url = :url", { url })
        .andWhere("inquiryResponseImage.uploader = :uploader", {
          uploader: email,
        })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedInquiryResponseImages.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async findUploadedInquiryResponseVideos(
    email: string,
    url: string,
  ): Promise<InquiryResponseVideoEntity> {
    try {
      return await this.inquiryResponseVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryResponseVideos)
        .from(InquiryResponseVideoEntity, "inquiryResponseVideo")
        .where("inquiryResponseVideo.url = :url", { url })
        .andWhere("inquiryResponseVideo.uploader = :uploader", {
          uploader: email,
        })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findUploadedInquiryResponseVideos.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setStuffs(email, "email")
        .setLayer("repository")
        .handle();
    }
  }

  async uploadProductImage(uploadMediaDto: UploadMediaDto): Promise<void> {
    try {
      await this.productImageRepository
        .createQueryBuilder()
        .insert()
        .into(ProductImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.methodName = this.uploadProductImage.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.uploadReviewImage.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.uploadReviewVideo.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.uploadInquiryRequestImage.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.uploadInquiryRequestVideo.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async uploadInquiryResponseImage(
    uploadMediaDto: UploadMediaDto,
  ): Promise<void> {
    try {
      await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryResponseImageEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.methodName = this.uploadInquiryResponseImage.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async uploadInquiryResponseVideo(
    uploadMediaDto: UploadMediaDto,
  ): Promise<void> {
    try {
      await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryResponseVideoEntity)
        .values({ ...uploadMediaDto })
        .execute();
    } catch (err) {
      this.methodName = this.uploadInquiryResponseVideo.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findProductImageWithUrl(url: string): Promise<ProductImageEntity> {
    try {
      return await this.productImageRepository
        .createQueryBuilder()
        .select(this.select.productImages)
        .from(ProductImageEntity, "productImage")
        .where("productImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findProductImageWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findReviewImageWithUrl(url: string): Promise<ReviewImageEntity> {
    try {
      return await this.reviewImageRepository
        .createQueryBuilder()
        .select(this.select.reviewImages)
        .from(ReviewImageEntity, "reviewImage")
        .leftJoin("reviewImage.Review", "Review")
        .where("reviewImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findReviewImageWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findReviewVideoWithUrl(url: string): Promise<ReviewVideoEntity> {
    try {
      return await this.reviewVideoRepository
        .createQueryBuilder()
        .select(this.select.reviewVideos)
        .from(ReviewVideoEntity, "reviewVideo")
        .leftJoin("reviewVideo.Review", "Review")
        .where("reviewVideo.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findReviewVideoWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findInquiryRequestImageWithUrl(
    url: string,
  ): Promise<InquiryRequestImageEntity> {
    try {
      return await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryRequestImages)
        .from(InquiryRequestImageEntity, "inquiryRequestImage")
        .leftJoin("inquiryRequestImage.InquiryRequest", "InquiryRequest")
        .where("inquiryRequestImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryRequestImageWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findInquiryRequestVideoWithUrl(
    url: string,
  ): Promise<InquiryRequestVideoEntity> {
    try {
      return await this.inquiryRequestVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryRequestVideos)
        .from(InquiryRequestVideoEntity, "inquiryRequestVideo")
        .leftJoin("inquiryRequestVideo.InquiryRequest", "InquiryRequest")
        .where("inquiryRequestVideo.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryRequestVideoWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findInquiryResponseImageWithUrl(
    url: string,
  ): Promise<InquiryResponseImageEntity> {
    try {
      return await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .select(this.select.inquiryResponseImages)
        .from(InquiryResponseImageEntity, "inquiryResponseImage")
        .leftJoin("inquiryResponseImage.InquiryResponse", "InquiryResponse")
        .where("inquiryResponseImage.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryResponseImageWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
    }
  }

  async findInquiryResponseVideoWithUrl(
    url: string,
  ): Promise<InquiryResponseVideoEntity> {
    try {
      return await this.inquiryResponseVideoRepository
        .createQueryBuilder()
        .select(this.select.inquiryResponseVideos)
        .from(InquiryResponseVideoEntity, "inquiryResponseVideo")
        .leftJoin("inquiryResponseVideo.InquiryResponse", "InquiryResponse")
        .where("inquiryResponseVideo.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findInquiryResponseVideoWithUrl.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(url, "url")
        .setLayer("repository")
        .handle();
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
      this.methodName = this.deleteProductImageWithId.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.deleteReviewImageWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.deleteReviewVideoWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async deleteInquiryRequestImageWithId(id: string): Promise<void> {
    try {
      await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryRequestImageEntity, "inquiryRequestImage")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.deleteInquiryRequestImageWithId.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async deleteInquiryRequestVideoWIthId(id: string): Promise<void> {
    try {
      await this.reviewVideoRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryRequestVideoEntity, "inquiryRequestVideo")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.deleteInquiryRequestVideoWIthId.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async deleteInquiryResponseImageWithId(id: string): Promise<void> {
    try {
      await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryResponseImageEntity, "inquiryResponseImage")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.deleteInquiryResponseImageWithId.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async deleteInquiryResponseVideoWithId(id: string): Promise<void> {
    try {
      await this.inquiryResponseVideoRepository
        .createQueryBuilder()
        .delete()
        .from(InquiryResponseVideoEntity, "inquiryResponseVideo")
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.deleteInquiryResponseVideoWithId.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findProductImageEvenUseWithId(id: string): Promise<ProductImageEntity> {
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
      this.methodName = this.findProductImageEvenUseWithId.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findBeforeReviewImagesWithId(id: string): Promise<ReviewImageEntity[]> {
    try {
      return await this.reviewImageRepository
        .createQueryBuilder()
        .select("reviewImages.id")
        .from(ReviewImageEntity, "reviewImages")
        .where("reviewImages.Review = :Review", { Review: id })
        .orderBy("reviewImages.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.methodName = this.findBeforeReviewImagesWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findBeforeReviewImageWithId(id: string): Promise<ReviewImageEntity> {
    try {
      return await this.reviewImageRepository
        .createQueryBuilder()
        .select("reviewImage.id")
        .from(ReviewImageEntity, "reviewImage")
        .where("reviewImage.Review = :Review", { Review: id })
        .orderBy("reviewImage.createdAt", "DESC")
        .getOne();
    } catch (err) {
      this.methodName = this.findBeforeReviewImageWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findBeforeReviewVideosWithId(id: string): Promise<ReviewVideoEntity[]> {
    try {
      return await this.reviewVideoRepository
        .createQueryBuilder()
        .select("reviewVideos.id")
        .from(ReviewVideoEntity, "reviewVideos")
        .where("reviewVideos.Review = :Review", { Review: id })
        .orderBy("reviewVideos.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.methodName = this.findBeforeReviewVideosWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async findBeforeReviewVideoWithId(id: string): Promise<ReviewVideoEntity> {
    try {
      return await this.reviewVideoRepository
        .createQueryBuilder()
        .select("reviewVideo.id")
        .from(ReviewVideoEntity, "reviewVideo")
        .where("reviewVideo.Review = :Review", { Review: id })
        .orderBy("reviewVideo.createdAt", "DESC")
        .getOne();
    } catch (err) {
      this.methodName = this.findBeforeReviewVideoWithId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }
}
