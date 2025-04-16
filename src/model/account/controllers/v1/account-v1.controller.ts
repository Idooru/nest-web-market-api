import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { AccountService } from "../../services/account.service";
import { AccountNumberValidatePipe } from "../../pipe/none-exist/account-number-validate.pipe";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";
import { AccountTransactionExecutor } from "../../logic/transaction/account-transaction.executor";
import { AccountIdValidatePipe } from "../../pipe/exist/account-id-validate.pipe";
import { AccountSearcher } from "../../logic/account.searcher";
import { AccountBody } from "../../dtos/request/account-body.dto";
import { WithdrawResultDto } from "../../dtos/response/withdraw-result.dto";
import { MoneyTransactionDto } from "../../dtos/request/money-transaction.dto";
import { DepositResultDto } from "../../dtos/response/deposit-result.dto";
import { FindAllAccountsDto } from "../../dtos/request/find-all-accounts.dto";
import { AccountBasicRawDto } from "../../dtos/response/account-basic-raw.dto";

@ApiTags("v1 User Account API")
@UseGuards(IsLoginGuard)
@Controller({ path: "/account", version: "1" })
export class AccountV1Controller {
  constructor(
    private readonly transaction: AccountTransactionExecutor,
    private readonly searcher: AccountSearcher,
    private readonly service: AccountService,
  ) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/all")
  public async findAccounts(
    @Query() query: FindAllAccountsDto,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<AccountBasicRawDto[]>> {
    query.userId = userId;
    const result = await this.searcher.findAllRaws(query);

    return {
      statusCode: 200,
      message: "계좌 정보를 가져옵니다.",
      result,
    };
  }

  // @ApiOperation({
  //   summary: "create account",
  //   description: "계좌를 생성합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/")
  public async createAccount(
    @Body(AccountNumberValidatePipe) body: AccountBody,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.transaction.createAccount(body, userId);

    return {
      statusCode: 201,
      message: "계좌를 생성하였습니다.",
    };
  }

  // @ApiOperation({
  //   summary: "delete account",
  //   description: "계좌를 제거합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:accountId")
  public async deleteAccount(
    @Param("accountId", AccountIdValidatePipe) accountId: string,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.transaction.deleteAccount(accountId, userId);

    return {
      statusCode: 200,
      message: "계좌를 제거하였습니다.",
    };
  }

  // @ApiOperation({
  //   summary: "withdraw",
  //   description: "계좌에 일정 금액을 출금합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:accountId/withdraw")
  public async withdraw(
    @Param("accountId", AccountIdValidatePipe) accountId: string,
    @Body() { balance }: { balance: number },
  ): Promise<JsonGeneralInterface<WithdrawResultDto>> {
    const dto: MoneyTransactionDto = { accountId, balance };
    const result = await this.service.withdraw(dto);

    return {
      statusCode: 201,
      message: `id(${accountId})에 해당하는 계좌에서 출금하였습니다.`,
      result,
    };
  }

  // @ApiOperation({
  //   summary: "deposit",
  //   description: "계좌에 일정 금액을 입금합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsClientGuard)
  @Patch("/:accountId/deposit")
  public async deposit(
    @Param("accountId", AccountIdValidatePipe) accountId: string,
    @Body() { balance }: { balance: number },
  ): Promise<JsonGeneralInterface<DepositResultDto>> {
    const dto: MoneyTransactionDto = { accountId, balance };
    const result = await this.service.deposit(dto);

    return {
      statusCode: 201,
      message: `id(${accountId})에 해당하는 계좌에 입금하였습니다.`,
      result,
    };
  }

  // @ApiOperation({
  //   summary: "set main account",
  //   description: "주로 사용할 계좌를 설정합니다.",
  // })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:accountId/main-account")
  public async setMainAccount(
    @Param("accountId", AccountIdValidatePipe) accountId: string,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.transaction.setMainAccount(accountId, userId);

    return {
      statusCode: 200,
      message: `id(${accountId})에 해당하는 계좌를 선택하였습니다.`,
    };
  }
}
