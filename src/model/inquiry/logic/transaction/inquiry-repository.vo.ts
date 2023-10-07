import { Repository } from "typeorm";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryRequestImageEntity } from "../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../../media/entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../../media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../../media/entities/inquiry-response-video.entity";

export interface InquiryRepositoryPayload {
  inquiryRequestRepository: Repository<InquiryRequestEntity>;
  inquiryRequestImageRepository: Repository<InquiryRequestImageEntity>;
  inquiryRequestVideoRepository: Repository<InquiryRequestVideoEntity>;
  inquiryResponseRepository: Repository<InquiryResponseEntity>;
  inquiryResponseImageRepository: Repository<InquiryResponseImageEntity>;
  inquiryResponseVideoRepository: Repository<InquiryResponseVideoEntity>;
}

export class InquiryRepositoryVO {
  private _inquiryRequestRepository: Repository<InquiryRequestEntity>;
  private _inquiryRequestImageRepository: Repository<InquiryRequestImageEntity>;
  private _inquiryRequestVideoRepository: Repository<InquiryRequestVideoEntity>;
  private _inquiryResponseRepository: Repository<InquiryResponseEntity>;
  private _inquiryResponseImageRepository: Repository<InquiryResponseImageEntity>;
  private _inquiryResponseVideoRepository: Repository<InquiryResponseVideoEntity>;

  public setRepositoryPayload(
    repositoryPayload: InquiryRepositoryPayload,
  ): void {
    const {
      inquiryRequestRepository,
      inquiryRequestImageRepository,
      inquiryRequestVideoRepository,
      inquiryResponseRepository,
      inquiryResponseImageRepository,
      inquiryResponseVideoRepository,
    } = repositoryPayload;

    this.inquiryRequestRepository = inquiryRequestRepository;
    this.inquiryRequestImageRepository = inquiryRequestImageRepository;
    this.inquiryRequestVideoRepository = inquiryRequestVideoRepository;
    this.inquiryResponseRepository = inquiryResponseRepository;
    this.inquiryResponseImageRepository = inquiryResponseImageRepository;
    this.inquiryResponseVideoRepository = inquiryResponseVideoRepository;
  }

  get inquiryRequestRepository(): Repository<InquiryRequestEntity> {
    return this._inquiryRequestRepository;
  }

  set inquiryRequestRepository(value: Repository<InquiryRequestEntity>) {
    this._inquiryRequestRepository = value;
  }

  get inquiryRequestImageRepository(): Repository<InquiryRequestImageEntity> {
    return this._inquiryRequestImageRepository;
  }

  set inquiryRequestImageRepository(
    value: Repository<InquiryRequestImageEntity>,
  ) {
    this._inquiryRequestImageRepository = value;
  }

  get inquiryRequestVideoRepository(): Repository<InquiryRequestVideoEntity> {
    return this._inquiryRequestVideoRepository;
  }

  set inquiryRequestVideoRepository(
    value: Repository<InquiryRequestVideoEntity>,
  ) {
    this._inquiryRequestVideoRepository = value;
  }

  get inquiryResponseRepository(): Repository<InquiryResponseEntity> {
    return this._inquiryResponseRepository;
  }

  set inquiryResponseRepository(value: Repository<InquiryResponseEntity>) {
    this._inquiryResponseRepository = value;
  }

  get inquiryResponseImageRepository(): Repository<InquiryResponseImageEntity> {
    return this._inquiryResponseImageRepository;
  }

  set inquiryResponseImageRepository(
    value: Repository<InquiryResponseImageEntity>,
  ) {
    this._inquiryResponseImageRepository = value;
  }

  get inquiryResponseVideoRepository(): Repository<InquiryResponseVideoEntity> {
    return this._inquiryResponseVideoRepository;
  }

  set inquiryResponseVideoRepository(
    value: Repository<InquiryResponseVideoEntity>,
  ) {
    this._inquiryResponseVideoRepository = value;
  }
}
