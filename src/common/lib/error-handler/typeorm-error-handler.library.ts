import { Logger } from "@nestjs/common";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { InquiryRequestErrorCase } from "src/model/inquiry/error/inquiry-request-error.case";
import { InquiryResponseErrorCase } from "src/model/inquiry/error/inquiry-response-error.case";
import { InquiryRequestImageErrorCase } from "src/model/media/error/inquiry-request-image-error.case";
import { InquiryRequestVideoErrorCase } from "src/model/media/error/inquiry-request-video-error.case";
import { InquiryResponseImageErrorCase } from "src/model/media/error/inquiry-response-image-error.case";
import { InquiryResponseVideoErrorCase } from "src/model/media/error/inquiry-response-video-error.case";
import { ProductImageErrorCase } from "src/model/media/error/product-image-error.case";
import { ReviewImageErrorCase } from "src/model/media/error/review-image-error.case";
import { ReviewVideoErrorCase } from "src/model/media/error/review-video.error.case";
import { ProductErrorCase } from "src/model/product/error/product-error.case";
import { ReviewErrorCase } from "src/model/review/error/review-error.case";
import { AdminUserErrorCase } from "src/model/user/error/admin-user-error.case";
import { ClientUserErrorCase } from "src/model/user/error/client-user-error.case";
import { UserErrorCase } from "src/model/user/error/user-error.case";
import { EntityTarget, TypeORMError } from "typeorm";
import { TypeOrmErrorHandlerBuilder } from "./typeorm-error-handler.builder";

export class TypeOrmErrorHandler {
  constructor(
    private readonly entity: EntityTarget,
    private readonly error: TypeORMError,
    private readonly className: string,
    private readonly methodName: string,
    private readonly stuffs: string[],
    private readonly stuffMeans: string[],
  ) {
    this.main();
  }

  private main() {
    this.logging();
    this.clearStuffs();
    this.checkSourceOfError();
  }

  private logging(): void {
    const className = new Logger(this.className);
    const methodName = new Logger(this.methodName);

    className.error(`Error occurred in ${this.className} class`);
    methodName.error(this.error);
  }

  private clearStuffs() {
    TypeOrmErrorHandlerBuilder.stuffs = [];
    TypeOrmErrorHandlerBuilder.stuffMeans = [];
  }

  private checkSourceOfError(): void {
    switch (this.entity.name) {
      case "ProductEntity":
        new ProductErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "ProductImageEntity":
        new ProductImageErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "UserEntity":
        new UserErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "ClientUserEntity":
        new ClientUserErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "AdminUserEntity":
        new AdminUserErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "ReviewEntity":
        new ReviewErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "ReviewImageEntity":
        new ReviewImageErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "ReviewVideoEntity":
        new ReviewVideoErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "InquiryRequestEntity":
        new InquiryRequestErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "InquiryRequestImageEntity":
        new InquiryRequestImageErrorCase(
          this.error,
          this.stuffs,
          this.stuffMeans,
        );
        break;
      case "InquiryRequestVideoEntity":
        new InquiryRequestVideoErrorCase(
          this.error,
          this.stuffs,
          this.stuffMeans,
        );
        break;
      case "InquiryResponseEntity":
        new InquiryResponseErrorCase(this.error, this.stuffs, this.stuffMeans);
        break;
      case "InquiryResponseImageEntity":
        new InquiryResponseImageErrorCase(
          this.error,
          this.stuffs,
          this.stuffMeans,
        );
        break;
      case "InquiryResponseVideoEntity":
        new InquiryResponseVideoErrorCase(
          this.error,
          this.stuffs,
          this.stuffMeans,
        );
        break;
      default: {
        throw new TypeOrmException(this.error);
      }
    }
  }
}
