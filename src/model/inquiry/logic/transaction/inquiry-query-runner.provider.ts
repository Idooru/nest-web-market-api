import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import {
  InquiryRepositoryPayload,
  InquiryRepositoryVO,
} from "./inquiry-repository.vo";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryRequestImageEntity } from "../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../../media/entities/inquiry-request-video.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryResponseImageEntity } from "../../../media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../../../media/entities/inquiry-response-video.entity";

@Injectable()
export class InquiryQueryRunnerProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly inquiryRepositoryVO: InquiryRepositoryVO,
  ) {}

  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositoryPayload: InquiryRepositoryPayload = {
      inquiryRequestRepository:
        queryRunner.manager.getRepository(InquiryRequestEntity),
      inquiryRequestImageRepository: queryRunner.manager.getRepository(
        InquiryRequestImageEntity,
      ),
      inquiryRequestVideoRepository: queryRunner.manager.getRepository(
        InquiryRequestVideoEntity,
      ),
      inquiryResponseRepository: queryRunner.manager.getRepository(
        InquiryResponseEntity,
      ),
      inquiryResponseImageRepository: queryRunner.manager.getRepository(
        InquiryResponseImageEntity,
      ),
      inquiryResponseVideoRepository: queryRunner.manager.getRepository(
        InquiryResponseVideoEntity,
      ),
    };

    this.inquiryRepositoryVO.setRepositoryPayload(repositoryPayload);

    return queryRunner;
  }
}
