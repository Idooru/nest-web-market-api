import { Injectable } from "@nestjs/common";
import { InquiryRepositoryPayload } from "./inquiry-repository.payload";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { InquiryTransactionSearcher } from "./inquiry-transaction.searcher";
import { InquiryTransactionContext } from "./inquiry-transaction.context";
import { CreateInquiryRequestDto } from "../../dto/inquiry-request/request/create-inquiry-request.dto";
import { CreateInquiryResponseDto } from "../../dto/inquiry-response/request/create-inquiry-response.dto";

@Injectable()
export class InquiryTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<InquiryRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: InquiryTransactionSearcher,
    private readonly context: InquiryTransactionContext,
  ) {}

  public async createInquiryRequest(dto: CreateInquiryRequestDto): Promise<void> {
    const search = await this.searcher.searchCreateInquiryRequest(dto);
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.createInquiryRequestContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async createInquiryResponse(dto: CreateInquiryResponseDto): Promise<void> {
    const search = await this.searcher.searchCreateInquiryResponse(dto);
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.createInquiryResponseContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }
}
