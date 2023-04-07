import { InternalServerErrorException, Logger } from "@nestjs/common";
import { InquiryRequestErrorCase } from "src/model/inquiry/error/inquiry-request-error.case";
import { InquiryResponseErrorCase } from "src/model/inquiry/error/inquiry-response-error.case";
import { InquiryRequestImageErrorCase } from "src/model/media/error/inquiry-request-image-error.case";
import { InquiryRequestVideoErrorCase } from "src/model/media/error/inquiry-request-video-error.case";
import { InquiryResponseVideoErrorCase } from "src/model/media/error/inquiry-response-video-error.case";
import { ProductImageErrorCase } from "src/model/media/error/product-image-error.case";
import { ReviewImageErrorCase } from "src/model/media/error/review-image-error.case";
import { ReviewVideoErrorCase } from "src/model/media/error/review-video.error.case";
import { ProductErrorCase } from "src/model/product/error/product-error.case";
import { ReviewErrorCase } from "src/model/review/error/review-error.case";
import { AdminUserErrorCase } from "src/model/user/error/admin-user-error.case";
import { ClientUserErrorCase } from "src/model/user/error/client-user-error.case";
import { UserErrorCase } from "src/model/user/error/user-error.case";

export class ErrorHandler<T> {
  constructor(
    private readonly entity: T,
    private readonly error: Error,
    private readonly className: string,
    private readonly methodName: string,
    private readonly stuff: string,
    private readonly stuffMean: string,
    private readonly layer: string,
  ) {
    this.logging();
    if (this.layer.includes("repository")) this.checkSourceOfError();
    this.throwInternalServerErrorException();
  }

  private logging(): void {
    const className = new Logger(this.className);
    const methodName = new Logger(this.methodName);

    className.error(`Error occurred in ${this.className} class`);
    methodName.error(this.error);
  }

  private checkSourceOfError(): void {
    switch (this.retrievingEntityName()) {
      case "Product":
        ProductErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "ProductImage":
        ProductImageErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "User":
        UserErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "ClientUser":
        ClientUserErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "AdminUser":
        AdminUserErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "Review":
        ReviewErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "ReviewImage":
        ReviewImageErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "ReviewVideo":
        ReviewVideoErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "InquiryRequest":
        InquiryRequestErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "InquiryRequestImage":
        InquiryRequestImageErrorCase.init(
          this.error,
          this.stuff,
          this.stuffMean,
        );
        break;
      case "InquiryRequestVideo":
        InquiryRequestVideoErrorCase.init(
          this.error,
          this.stuff,
          this.stuffMean,
        );
        break;
      case "InquiryResponse":
        InquiryResponseErrorCase.init(this.error, this.stuff, this.stuffMean);
        break;
      case "InquiryResponseImage":
        InquiryRequestImageErrorCase.init(
          this.error,
          this.stuff,
          this.stuffMean,
        );
        break;
      case "InquiryResponseVideo":
        InquiryResponseVideoErrorCase.init(
          this.error,
          this.stuff,
          this.stuffMean,
        );
        break;
      default: {
        this.throwInternalServerErrorException();
      }
    }
  }

  private throwInternalServerErrorException(): never {
    throw new InternalServerErrorException(this.error.message);
  }

  private retrievingEntityName(): string {
    return this.entity.constructor.name.replace("Entity", "");
  }
}
