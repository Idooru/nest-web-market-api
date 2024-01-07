import { Injectable } from "@nestjs/common";
import { PrepareToCreateInquiryRequestDto } from "../../dto/request/create-inquiry-request.dto";
import { PrepareToCreateInquiryResponseDto } from "../../dto/response/create-inquiry-response.dto";
import { InquiryRepositoryPayload } from "./inquiry-repository.payload";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { InquiryTransactionSearcher } from "./inquiry-transaction.searcher";
import { InquiryTransactionContext } from "./inquiry-transaction.context";

@Injectable()
export class InquiryTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<InquiryRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: InquiryTransactionSearcher,
    private readonly context: InquiryTransactionContext,
  ) {}

  public async createInquiryRequest(
    dto: PrepareToCreateInquiryRequestDto,
  ): Promise<void> {
    const search = await this.searcher.searchToCreateInquiryRequest(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);
    await this.context
      .createInquiryRequestContext(search)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }

  public async createInquiryResponse(
    dto: PrepareToCreateInquiryResponseDto,
  ): Promise<void> {
    const search = await this.searcher.searchToCreateInquiryResponse(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);
    await this.context
      .createInquiryResponseContext(search)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }
}
