import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { JsonGeneralInterceptor } from "../../../../common/interceptors/general/json-general.interceptor";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { JsonGeneralInterface } from "../../../../common/interceptors/interface/json-general-interface";
import { AccountUpdateService } from "../../services/account-update.service";
import { AccountBodyDto } from "../../dtos/account-body.dto";
import { AccountValidatePipe } from "../../pipe/none-exist/account-validate.pipe";
import { MoneyTransactionDto } from "../../dtos/money-transaction.dto";
import { WithdrawResultDto } from "../../dtos/withdraw-result.dto";
import { DepositResultDto } from "../../dtos/deposit-result.dto";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";

@ApiTags("v1 User Account API")
@UseGuards(IsLoginGuard)
@Controller({ path: "/account", version: "1" })
export class AccountV1Controller {
  constructor(private readonly accountUpdateService: AccountUpdateService) {}

  @ApiOperation({
    summary: "create account",
    description: "계좌를 생성합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Post("/")
  public async createAccount(
    @Body(AccountValidatePipe) accountBodyDto: AccountBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.accountUpdateService.createAccount(accountBodyDto, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "계좌를 생성하였습니다.",
    };
  }

  @ApiOperation({
    summary: "delete account",
    description: "계좌를 제거합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:accountId")
  public async deleteAccount(@Param("accountId") accountId: string): Promise<JsonGeneralInterface<void>> {
    await this.accountUpdateService.deleteAccount(accountId);

    return {
      statusCode: 200,
      message: "계좌를 제거하였습니다.",
    };
  }

  @ApiOperation({
    summary: "deposit",
    description: "계좌에 일정 금액을 입금합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsClientGuard)
  @Patch("/deposit")
  public async deposit(@Body() depositBodyDto: MoneyTransactionDto): Promise<JsonGeneralInterface<DepositResultDto>> {
    const result = await this.accountUpdateService.deposit(depositBodyDto);

    return {
      statusCode: 201,
      message: `id(${depositBodyDto.accountId})에 해당하는 계좌에 입금하였습니다.`,
      result,
    };
  }

  @ApiOperation({
    summary: "withdraw",
    description: "계좌에 일정 금액을 출금합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/withdraw")
  public async withdraw(
    @Body() withdrawBodyDto: MoneyTransactionDto,
  ): Promise<JsonGeneralInterface<WithdrawResultDto>> {
    const result = await this.accountUpdateService.withdraw(withdrawBodyDto);

    return {
      statusCode: 201,
      message: `id(${withdrawBodyDto.accountId})에 해당하는 계좌에서 출금하였습니다.`,
      result,
    };
  }

  @ApiOperation({
    summary: "set main account",
    description: "주로 사용할 계좌를 설정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/:accountId")
  public async setMainAccount(
    @Param("accountId") accountId: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.accountUpdateService.setMainAccount(accountId, jwtPayload.userId);

    return {
      statusCode: 200,
      message: `id(${accountId})에 해당하는 계좌를 선택하였습니다.`,
    };
  }
}
